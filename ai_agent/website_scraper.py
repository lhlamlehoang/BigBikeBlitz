import asyncio
import logging
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from typing import Dict, Any, Optional, List
import re
import time

logger = logging.getLogger(__name__)

class WebsiteScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    async def scrape_page(self, url: str) -> Optional[Dict[str, Any]]:
        """Scrape a single page and extract relevant information"""
        try:
            logger.info(f"Scraping: {url}")
            
            # Try with requests first
            response = await self._fetch_with_requests(url)
            if response:
                return response
            
            # Fallback to Selenium for dynamic content
            return await self._fetch_with_selenium(url)
            
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
            return None
    
    async def _fetch_with_requests(self, url: str) -> Optional[Dict[str, Any]]:
        """Fetch page content using requests"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title = soup.find('title')
            title_text = title.get_text().strip() if title else "BigBikeBlitz"
            
            # Extract main content
            content = self._extract_content(soup)
            
            # Extract metadata
            metadata = self._extract_metadata(soup, url)
            
            return {
                "url": url,
                "title": title_text,
                "content": content,
                "metadata": metadata
            }
            
        except Exception as e:
            logger.warning(f"Requests failed for {url}: {e}")
            return None
    
    async def _fetch_with_selenium(self, url: str) -> Optional[Dict[str, Any]]:
        """Fetch page content using Selenium for dynamic content"""
        driver = None
        try:
            # Setup Chrome options
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            # Initialize driver
            driver = webdriver.Chrome(
                service=webdriver.chrome.service.Service(ChromeDriverManager().install()),
                options=chrome_options
            )
            
            # Load page
            driver.get(url)
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Get page content
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Extract title
            title = soup.find('title')
            title_text = title.get_text().strip() if title else "BigBikeBlitz"
            
            # Extract main content
            content = self._extract_content(soup)
            
            # Extract metadata
            metadata = self._extract_metadata(soup, url)
            
            return {
                "url": url,
                "title": title_text,
                "content": content,
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"Selenium failed for {url}: {e}")
            return None
        finally:
            if driver:
                driver.quit()
    
    def _extract_content(self, soup: BeautifulSoup) -> str:
        """Extract main content from the page"""
        content_parts = []
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Extract text from main content areas
        main_selectors = [
            'main',
            '[role="main"]',
            '.main-content',
            '.content',
            '#content',
            'article',
            '.product-details',
            '.product-info'
        ]
        
        for selector in main_selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(separator=' ', strip=True)
                if text and len(text) > 50:  # Only include substantial content
                    content_parts.append(text)
        
        # If no main content found, extract from body
        if not content_parts:
            body = soup.find('body')
            if body:
                text = body.get_text(separator=' ', strip=True)
                content_parts.append(text)
        
        # Clean and combine content
        combined_content = ' '.join(content_parts)
        combined_content = re.sub(r'\s+', ' ', combined_content)  # Remove extra whitespace
        combined_content = combined_content.strip()
        
        return combined_content
    
    def _extract_metadata(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Extract metadata from the page"""
        metadata = {
            "type": "page",
            "url": url
        }
        
        # Extract meta tags
        meta_tags = soup.find_all('meta')
        for meta in meta_tags:
            name = meta.get('name', '').lower()
            content = meta.get('content', '')
            
            if name in ['description', 'keywords', 'author']:
                metadata[name] = content
        
        # Detect page type based on URL and content
        if 'product' in url.lower() or 'bike' in url.lower():
            metadata["type"] = "product"
        elif 'category' in url.lower():
            metadata["type"] = "category"
        elif 'about' in url.lower():
            metadata["type"] = "about"
        elif 'contact' in url.lower():
            metadata["type"] = "contact"
        elif 'help' in url.lower():
            metadata["type"] = "help"
        
        # Extract product information if available
        if metadata["type"] == "product":
            product_info = self._extract_product_info(soup)
            metadata.update(product_info)
        
        return metadata
    
    def _extract_product_info(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract product-specific information"""
        product_info = {}
        
        # Extract price
        price_selectors = [
            '.price',
            '.product-price',
            '[data-price]',
            '.cost',
            '.amount'
        ]
        
        for selector in price_selectors:
            price_elem = soup.select_one(selector)
            if price_elem:
                price_text = price_elem.get_text().strip()
                if price_text:
                    product_info["price"] = price_text
                    break
        
        # Extract brand
        brand_selectors = [
            '.brand',
            '.product-brand',
            '[data-brand]',
            '.manufacturer'
        ]
        
        for selector in brand_selectors:
            brand_elem = soup.select_one(selector)
            if brand_elem:
                brand_text = brand_elem.get_text().strip()
                if brand_text:
                    product_info["brand"] = brand_text
                    break
        
        # Extract model
        model_selectors = [
            '.model',
            '.product-model',
            '[data-model]',
            '.product-name'
        ]
        
        for selector in model_selectors:
            model_elem = soup.select_one(selector)
            if model_elem:
                model_text = model_elem.get_text().strip()
                if model_text:
                    product_info["model"] = model_text
                    break
        
        return product_info
    
    async def scrape_multiple_pages(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Scrape multiple pages concurrently"""
        tasks = [self.scrape_page(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out None results and exceptions
        valid_results = []
        for result in results:
            if isinstance(result, dict):
                valid_results.append(result)
            elif isinstance(result, Exception):
                logger.error(f"Scraping error: {result}")
        
        return valid_results
    
    async def scrape_sitemap(self, sitemap_url: str) -> List[str]:
        """Extract URLs from sitemap"""
        try:
            response = self.session.get(sitemap_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'xml')
            urls = []
            
            # Extract URLs from sitemap
            for loc in soup.find_all('loc'):
                url = loc.get_text().strip()
                if url:
                    urls.append(url)
            
            return urls
            
        except Exception as e:
            logger.error(f"Error scraping sitemap {sitemap_url}: {e}")
            return []
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\.\,\!\?\-\$]', '', text)
        
        return text.strip() 