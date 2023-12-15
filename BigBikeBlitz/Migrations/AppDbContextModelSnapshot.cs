﻿// <auto-generated />
using System;
using BigBikeBlitz.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BigBikeBlitz.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("BigBikeBlitz.Models.Bike", b =>
                {
                    b.Property<int>("bikeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("bikeId"), 1L, 1);

                    b.Property<double?>("CC")
                        .HasColumnType("float");

                    b.Property<string>("bikeName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("date")
                        .HasColumnType("int");

                    b.Property<string>("photo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("price")
                        .HasColumnType("float");

                    b.Property<int>("userId")
                        .HasColumnType("int");

                    b.HasKey("bikeId");

                    b.HasIndex("userId");

                    b.ToTable("Bikes");
                });

            modelBuilder.Entity("BigBikeBlitz.Models.User", b =>
                {
                    b.Property<int>("userId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("userId"), 1L, 1);

                    b.Property<string>("avatar")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("role")
                        .HasColumnType("int");

                    b.Property<string>("userName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("userId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("BigBikeBlitz.Models.Bike", b =>
                {
                    b.HasOne("BigBikeBlitz.Models.User", "User")
                        .WithMany("Bikes")
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BigBikeBlitz.Models.User", b =>
                {
                    b.Navigation("Bikes");
                });
#pragma warning restore 612, 618
        }
    }
}
