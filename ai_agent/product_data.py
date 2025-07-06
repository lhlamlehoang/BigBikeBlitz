"""
Product Data Seeder for BigBikeBlitz AI Agent
Adds sample motorcycle product data to the knowledge base
"""

import asyncio
import logging
from typing import List, Dict, Any
from knowledge_base import KnowledgeBase

logger = logging.getLogger(__name__)

class ProductDataSeeder:
    def __init__(self):
        self.knowledge_base = KnowledgeBase()
        
    async def seed_product_data(self):
        """Seed the knowledge base with sample product data"""
        products = self._get_sample_products()
        
        for product in products:
            try:
                await self.knowledge_base.add_document(product)
                logger.info(f"Added product: {product['title']}")
            except Exception as e:
                logger.error(f"Error adding product {product['title']}: {e}")
        
        logger.info(f"Seeded {len(products)} products to knowledge base")
    
    def _get_sample_products(self) -> List[Dict[str, Any]]:
        """Get sample motorcycle product data"""
        return [
            {
                "url": "https://bigbikeblitz.com/products/bmw-s1000-rr",
                "title": "BMW S1000 RR",
                "content": """
                BMW S1000 RR - The Ultimate Sport Motorcycle
                
                Price: $17,995 MSRP
                Engine: 999cc inline-four
                Power: 205 horsepower
                Torque: 83 lb-ft
                Weight: 434 lbs (wet)
                
                The BMW S1000 RR is the pinnacle of sport motorcycle engineering. This track-focused machine delivers incredible performance with advanced electronics including Dynamic Traction Control, ABS Pro, and multiple riding modes. The S1000 RR features a lightweight frame, premium suspension components, and cutting-edge aerodynamics for maximum speed and control.
                
                Key Features:
                - 999cc inline-four engine with 205 horsepower
                - Dynamic Traction Control (DTC)
                - ABS Pro with cornering capability
                - Multiple riding modes (Rain, Road, Dynamic, Race)
                - Lightweight aluminum frame
                - Premium suspension with electronic adjustment
                - Advanced aerodynamics with winglets
                - Full LED lighting
                - 6.5-inch TFT display
                
                Available Colors: Light White, Racing Red, Black Storm Metallic
                Warranty: 3-year unlimited mileage warranty
                Financing: Available with competitive rates starting at 3.9% APR
                """,
                "metadata": {
                    "type": "product",
                    "brand": "BMW",
                    "model": "S1000 RR",
                    "category": "Sport Motorcycle",
                    "price": "$17,995",
                    "engine_size": "999cc",
                    "horsepower": "205",
                    "year": "2024"
                }
            },
            {
                "url": "https://bigbikeblitz.com/products/bmw-r1250-gs",
                "title": "BMW R1250 GS",
                "content": """
                BMW R1250 GS - The Adventure Motorcycle Legend
                
                Price: $18,895 MSRP
                Engine: 1254cc boxer twin
                Power: 136 horsepower
                Torque: 105 lb-ft
                Weight: 549 lbs (wet)
                
                The BMW R1250 GS is the ultimate adventure motorcycle, combining legendary reliability with cutting-edge technology. This versatile machine excels both on and off-road, featuring BMW's innovative ShiftCam technology, advanced electronics, and premium comfort features for long-distance touring.
                
                Key Features:
                - 1254cc boxer twin engine with ShiftCam technology
                - 136 horsepower and 105 lb-ft of torque
                - Dynamic ESA (Electronic Suspension Adjustment)
                - ABS Pro with cornering capability
                - Multiple riding modes
                - LED lighting system
                - 10.25-inch TFT display with navigation
                - Comfort seat with heating option
                - Crash bars and protection equipment
                
                Available Colors: Alpine White, Black Storm Metallic, Rallye Blue
                Warranty: 3-year unlimited mileage warranty
                Financing: Available with competitive rates starting at 3.9% APR
                """,
                "metadata": {
                    "type": "product",
                    "brand": "BMW",
                    "model": "R1250 GS",
                    "category": "Adventure Motorcycle",
                    "price": "$18,895",
                    "engine_size": "1254cc",
                    "horsepower": "136",
                    "year": "2024"
                }
            },
            {
                "url": "https://bigbikeblitz.com/products/honda-cbr1000rr-r",
                "title": "Honda CBR1000RR-R Fireblade",
                "content": """
                Honda CBR1000RR-R Fireblade - Precision Engineering
                
                Price: $16,799 MSRP
                Engine: 999.9cc inline-four
                Power: 217 horsepower
                Torque: 83 lb-ft
                Weight: 441 lbs (wet)
                
                The Honda CBR1000RR-R Fireblade represents the pinnacle of Honda's racing technology transferred to the street. This MotoGP-inspired machine features advanced aerodynamics, electronic rider aids, and precision engineering for ultimate performance and control.
                
                Key Features:
                - 999.9cc inline-four engine with 217 horsepower
                - Honda Selectable Torque Control (HSTC)
                - ABS with cornering capability
                - Multiple power modes
                - Öhlins electronic suspension
                - Advanced aerodynamics with winglets
                - Full LED lighting
                - 5-inch TFT display
                
                Available Colors: Grand Prix Red, Pearl White
                Warranty: 1-year unlimited mileage warranty
                Financing: Available with competitive rates starting at 4.9% APR
                """,
                "metadata": {
                    "type": "product",
                    "brand": "Honda",
                    "model": "CBR1000RR-R Fireblade",
                    "category": "Sport Motorcycle",
                    "price": "$16,799",
                    "engine_size": "999.9cc",
                    "horsepower": "217",
                    "year": "2024"
                }
            },
            {
                "url": "https://bigbikeblitz.com/products/yamaha-yzf-r1",
                "title": "Yamaha YZF-R1",
                "content": """
                Yamaha YZF-R1 - The R-Series Legend
                
                Price: $18,099 MSRP
                Engine: 998cc crossplane inline-four
                Power: 200 horsepower
                Torque: 83 lb-ft
                Weight: 448 lbs (wet)
                
                The Yamaha YZF-R1 continues the legacy of the R-Series with cutting-edge technology and race-proven performance. This track-focused machine features Yamaha's innovative crossplane crankshaft technology, advanced electronics, and aerodynamic design for maximum performance.
                
                Key Features:
                - 998cc crossplane inline-four engine
                - 200 horsepower with crossplane crankshaft
                - Yamaha Chip Controlled Throttle (YCC-T)
                - Traction Control System (TCS)
                - Slide Control System (SCS)
                - Lift Control System (LCS)
                - Öhlins electronic suspension
                - Advanced aerodynamics
                - Full LED lighting
                - 6.1-inch TFT display
                
                Available Colors: Team Yamaha Blue, Matte Black
                Warranty: 1-year unlimited mileage warranty
                Financing: Available with competitive rates starting at 4.9% APR
                """,
                "metadata": {
                    "type": "product",
                    "brand": "Yamaha",
                    "model": "YZF-R1",
                    "category": "Sport Motorcycle",
                    "price": "$18,099",
                    "engine_size": "998cc",
                    "horsepower": "200",
                    "year": "2024"
                }
            },
            {
                "url": "https://bigbikeblitz.com/products/kawasaki-ninja-zx-10r",
                "title": "Kawasaki Ninja ZX-10R",
                "content": """
                Kawasaki Ninja ZX-10R - World Superbike Champion
                
                Price: $16,599 MSRP
                Engine: 998cc inline-four
                Power: 203 horsepower
                Torque: 83 lb-ft
                Weight: 456 lbs (wet)
                
                The Kawasaki Ninja ZX-10R is the street version of the World Superbike Championship-winning machine. This track-focused motorcycle features Kawasaki's advanced electronics package, aerodynamic design, and race-proven technology for ultimate performance.
                
                Key Features:
                - 998cc inline-four engine with 203 horsepower
                - Kawasaki Traction Control (KTRC)
                - Kawasaki Intelligent anti-lock Brake System (KIBS)
                - Kawasaki Launch Control Mode (KLCM)
                - Kawasaki Engine Brake Control (KEBC)
                - Öhlins electronic suspension
                - Advanced aerodynamics with winglets
                - Full LED lighting
                - 4.3-inch TFT display
                
                Available Colors: Lime Green, Metallic Carbon Gray
                Warranty: 1-year unlimited mileage warranty
                Financing: Available with competitive rates starting at 4.9% APR
                """,
                "metadata": {
                    "type": "product",
                    "brand": "Kawasaki",
                    "model": "Ninja ZX-10R",
                    "category": "Sport Motorcycle",
                    "price": "$16,599",
                    "engine_size": "998cc",
                    "horsepower": "203",
                    "year": "2024"
                }
            }
        ]

async def main():
    """Main function to seed product data"""
    seeder = ProductDataSeeder()
    await seeder.seed_product_data()

if __name__ == "__main__":
    asyncio.run(main()) 