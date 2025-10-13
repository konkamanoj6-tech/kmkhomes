#!/usr/bin/env python3
"""
KMK Homes Backend API Testing Suite
Tests all backend APIs including admin authentication, CRUD operations, and file handling.
"""

import requests
import json
import os
import tempfile
from typing import Dict, Any, Optional
import uuid

class KMKHomesAPITester:
    def __init__(self):
        # Get backend URL from environment
        self.base_url = "https://kmkhomes-cms.preview.emergentagent.com"
        try:
            with open('/app/frontend/.env', 'r') as f:
                for line in f:
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        self.base_url = line.split('=')[1].strip()
                        break
        except FileNotFoundError:
            pass
        
        self.api_url = f"{self.base_url}/api"
        self.auth_token = None
        self.test_results = []
        
        print(f"Testing backend at: {self.api_url}")
    
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result."""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_admin_login(self) -> bool:
        """Test admin authentication."""
        try:
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = requests.post(
                f"{self.api_url}/admin/auth/login",
                json=login_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.auth_token = data["access_token"]
                    self.log_result("Admin Login", True, "Successfully authenticated")
                    return True
                else:
                    self.log_result("Admin Login", False, "No access token in response", data)
                    return False
            else:
                self.log_result("Admin Login", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Login", False, f"Connection error: {str(e)}")
            return False
    
    def get_auth_headers(self) -> Dict[str, str]:
        """Get authorization headers."""
        if not self.auth_token:
            return {}
        return {"Authorization": f"Bearer {self.auth_token}"}
    
    def test_file_upload(self) -> Optional[str]:
        """Test file upload API."""
        try:
            # Create a test image file
            test_content = b"fake image content for testing"
            
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
                tmp_file.write(test_content)
                tmp_file.flush()
                
                with open(tmp_file.name, 'rb') as f:
                    files = {'file': ('test_image.jpg', f, 'image/jpeg')}
                    
                    response = requests.post(
                        f"{self.api_url}/admin/upload",
                        files=files,
                        headers=self.get_auth_headers(),
                        timeout=10
                    )
                
                os.unlink(tmp_file.name)
            
            if response.status_code == 200:
                data = response.json()
                if "file_url" in data:
                    file_url = data["file_url"]
                    self.log_result("File Upload", True, f"File uploaded successfully: {data['filename']}")
                    
                    # Test if uploaded file is accessible
                    file_response = requests.get(file_url, timeout=5)
                    if file_response.status_code == 200:
                        self.log_result("File Access", True, "Uploaded file is accessible")
                    else:
                        self.log_result("File Access", False, f"Uploaded file not accessible: HTTP {file_response.status_code}")
                    
                    return file_url
                else:
                    self.log_result("File Upload", False, "No file_url in response", data)
                    return None
            else:
                self.log_result("File Upload", False, f"HTTP {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result("File Upload", False, f"Error: {str(e)}")
            return None
    
    def test_home_banners_crud(self):
        """Test Home Banners CRUD operations."""
        banner_id = None
        test_image_url = "https://example.com/test-banner.jpg"
        
        try:
            # CREATE Banner
            banner_data = {
                "title": "Test Banner",
                "subtitle": "Test Subtitle",
                "image_url": test_image_url,
                "cta_text": "Learn More",
                "cta_link": "/properties",
                "display_order": 1
            }
            
            response = requests.post(
                f"{self.api_url}/admin/home-banners",
                json=banner_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                banner_id = data.get("id")
                self.log_result("Banner CREATE", True, f"Banner created with ID: {banner_id}")
            else:
                self.log_result("Banner CREATE", False, f"HTTP {response.status_code}", response.text)
                return
            
            # READ Banners
            response = requests.get(
                f"{self.api_url}/admin/home-banners",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                banners = response.json()
                found_banner = next((b for b in banners if b.get("_id") == banner_id), None)
                if found_banner:
                    self.log_result("Banner READ", True, f"Found created banner in list")
                else:
                    self.log_result("Banner READ", False, "Created banner not found in list")
            else:
                self.log_result("Banner READ", False, f"HTTP {response.status_code}", response.text)
            
            # UPDATE Banner
            if banner_id:
                update_data = {
                    "title": "Updated Test Banner",
                    "subtitle": "Updated Subtitle",
                    "image_url": test_image_url,
                    "cta_text": "Updated CTA",
                    "cta_link": "/updated-link",
                    "display_order": 2
                }
                
                response = requests.put(
                    f"{self.api_url}/admin/home-banners/{banner_id}",
                    json=update_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Banner UPDATE", True, "Banner updated successfully")
                else:
                    self.log_result("Banner UPDATE", False, f"HTTP {response.status_code}", response.text)
            
            # DELETE Banner
            if banner_id:
                response = requests.delete(
                    f"{self.api_url}/admin/home-banners/{banner_id}",
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Banner DELETE", True, "Banner deleted successfully")
                else:
                    self.log_result("Banner DELETE", False, f"HTTP {response.status_code}", response.text)
                    
        except Exception as e:
            self.log_result("Banner CRUD", False, f"Error: {str(e)}")
    
    def test_testimonials_crud(self):
        """Test Testimonials CRUD operations."""
        testimonial_id = None
        test_image_url = "https://example.com/test-person.jpg"
        
        try:
            # CREATE Testimonial
            testimonial_data = {
                "name": "John Smith",
                "location": "Hyderabad",
                "testimonial": "Excellent service and beautiful homes. Highly recommended!",
                "image_url": test_image_url,
                "rating": 5,
                "featured": True,
                "display_order": 1
            }
            
            response = requests.post(
                f"{self.api_url}/admin/testimonials",
                json=testimonial_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                testimonial_id = data.get("id")
                self.log_result("Testimonial CREATE", True, f"Testimonial created with ID: {testimonial_id}")
            else:
                self.log_result("Testimonial CREATE", False, f"HTTP {response.status_code}", response.text)
                return
            
            # READ Testimonials
            response = requests.get(
                f"{self.api_url}/admin/testimonials",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                testimonials = response.json()
                found_testimonial = next((t for t in testimonials if t.get("_id") == testimonial_id), None)
                if found_testimonial:
                    self.log_result("Testimonial READ", True, f"Found created testimonial in list")
                else:
                    self.log_result("Testimonial READ", False, "Created testimonial not found in list")
            else:
                self.log_result("Testimonial READ", False, f"HTTP {response.status_code}", response.text)
            
            # UPDATE Testimonial
            if testimonial_id:
                update_data = {
                    "name": "John Smith Updated",
                    "location": "Bangalore",
                    "testimonial": "Updated testimonial text with even better experience!",
                    "image_url": test_image_url,
                    "rating": 5,
                    "featured": False,
                    "display_order": 2
                }
                
                response = requests.put(
                    f"{self.api_url}/admin/testimonials/{testimonial_id}",
                    json=update_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Testimonial UPDATE", True, "Testimonial updated successfully")
                else:
                    self.log_result("Testimonial UPDATE", False, f"HTTP {response.status_code}", response.text)
            
            # DELETE Testimonial
            if testimonial_id:
                response = requests.delete(
                    f"{self.api_url}/admin/testimonials/{testimonial_id}",
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Testimonial DELETE", True, "Testimonial deleted successfully")
                else:
                    self.log_result("Testimonial DELETE", False, f"HTTP {response.status_code}", response.text)
                    
        except Exception as e:
            self.log_result("Testimonial CRUD", False, f"Error: {str(e)}")
    
    def test_properties_api(self):
        """Test Properties API endpoints."""
        try:
            # Test public properties listing
            response = requests.get(f"{self.api_url}/properties", timeout=10)
            
            if response.status_code == 200:
                properties = response.json()
                self.log_result("Properties Listing", True, f"Retrieved {len(properties)} properties")
                
                # Test property detail if properties exist
                if properties:
                    property_id = properties[0].get("_id")
                    if property_id:
                        detail_response = requests.get(f"{self.api_url}/properties/{property_id}", timeout=10)
                        
                        if detail_response.status_code == 200:
                            property_detail = detail_response.json()
                            self.log_result("Property Detail", True, f"Retrieved property detail for ID: {property_id}")
                        else:
                            self.log_result("Property Detail", False, f"HTTP {detail_response.status_code}", detail_response.text)
                    else:
                        self.log_result("Property Detail", False, "No property ID found in first property")
                else:
                    self.log_result("Property Detail", False, "No properties available to test detail endpoint")
            else:
                self.log_result("Properties Listing", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Properties API", False, f"Error: {str(e)}")
    
    def test_public_endpoints(self):
        """Test public API endpoints."""
        endpoints = [
            ("/home-banners", "Home Banners Public"),
            ("/testimonials", "Testimonials Public"),
            ("/contact-info", "Contact Info"),
        ]
        
        for endpoint, name in endpoints:
            try:
                response = requests.get(f"{self.api_url}{endpoint}", timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(name, True, f"Retrieved data successfully")
                else:
                    self.log_result(name, False, f"HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_result(name, False, f"Error: {str(e)}")
    
    def test_health_check(self):
        """Test API health check."""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, "API is healthy")
                else:
                    self.log_result("Health Check", False, "API not reporting healthy status", data)
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Health Check", False, f"Error: {str(e)}")
    
    def test_budget_homes_crud(self):
        """Test Budget Homes CRUD operations."""
        home_id = None
        test_image_url = "https://example.com/test-budget-home.jpg"
        
        try:
            # CREATE Budget Home
            home_data = {
                "property_name": "Affordable Dream Villa",
                "location": "Hyderabad",
                "price_range": "₹45-55 Lakhs",
                "property_type": "Villa",
                "built_up_area": "1600 sq.ft",
                "facing": "East",
                "description": "Beautiful 3BHK villa with modern amenities and excellent connectivity.",
                "main_image": test_image_url,
                "gallery_images": [test_image_url, "https://example.com/gallery1.jpg"],
                "youtube_link": "https://youtube.com/watch?v=test123",
                "area": "Kompally",
                "status": "Available",
                "display_order": 1
            }
            
            response = requests.post(
                f"{self.api_url}/admin/budget-homes",
                json=home_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                home_id = data.get("id")
                self.log_result("Budget Home CREATE", True, f"Budget home created with ID: {home_id}")
            else:
                self.log_result("Budget Home CREATE", False, f"HTTP {response.status_code}", response.text)
                return
            
            # READ Budget Homes
            response = requests.get(
                f"{self.api_url}/admin/budget-homes",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                homes = response.json()
                found_home = next((h for h in homes if h.get("_id") == home_id), None)
                if found_home:
                    self.log_result("Budget Home READ", True, f"Found created budget home in list")
                else:
                    self.log_result("Budget Home READ", False, "Created budget home not found in list")
            else:
                self.log_result("Budget Home READ", False, f"HTTP {response.status_code}", response.text)
            
            # UPDATE Budget Home
            if home_id:
                update_data = {
                    "property_name": "Updated Affordable Villa",
                    "location": "Bangalore",
                    "price_range": "₹50-60 Lakhs",
                    "property_type": "Independent House",
                    "built_up_area": "1800 sq.ft",
                    "facing": "North",
                    "description": "Updated description with enhanced features.",
                    "main_image": test_image_url,
                    "gallery_images": [test_image_url],
                    "youtube_link": "https://youtube.com/watch?v=updated123",
                    "area": "Whitefield",
                    "status": "Available",
                    "display_order": 2
                }
                
                response = requests.put(
                    f"{self.api_url}/admin/budget-homes/{home_id}",
                    json=update_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Budget Home UPDATE", True, "Budget home updated successfully")
                else:
                    self.log_result("Budget Home UPDATE", False, f"HTTP {response.status_code}", response.text)
            
            # DELETE Budget Home
            if home_id:
                response = requests.delete(
                    f"{self.api_url}/admin/budget-homes/{home_id}",
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Budget Home DELETE", True, "Budget home deleted successfully")
                else:
                    self.log_result("Budget Home DELETE", False, f"HTTP {response.status_code}", response.text)
                    
        except Exception as e:
            self.log_result("Budget Home CRUD", False, f"Error: {str(e)}")
    
    def test_plots_crud(self):
        """Test Plots CRUD operations."""
        plot_id = None
        test_image_url = "https://example.com/test-plot.jpg"
        
        try:
            # CREATE Plot
            plot_data = {
                "plot_name": "Premium Residential Plot",
                "location": "Hyderabad",
                "plot_area": "300 sq.yds",
                "price_range": "₹25-35 Lakhs",
                "property_type": "Residential",
                "description": "Well-located residential plot with clear title and all approvals.",
                "main_image": test_image_url,
                "gallery_images": [test_image_url, "https://example.com/plot-gallery1.jpg"],
                "youtube_link": "https://youtube.com/watch?v=plot123",
                "status": "Available",
                "display_order": 1
            }
            
            response = requests.post(
                f"{self.api_url}/admin/plots",
                json=plot_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                plot_id = data.get("id")
                self.log_result("Plot CREATE", True, f"Plot created with ID: {plot_id}")
            else:
                self.log_result("Plot CREATE", False, f"HTTP {response.status_code}", response.text)
                return
            
            # READ Plots
            response = requests.get(
                f"{self.api_url}/admin/plots",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                plots = response.json()
                found_plot = next((p for p in plots if p.get("_id") == plot_id), None)
                if found_plot:
                    self.log_result("Plot READ", True, f"Found created plot in list")
                else:
                    self.log_result("Plot READ", False, "Created plot not found in list")
            else:
                self.log_result("Plot READ", False, f"HTTP {response.status_code}", response.text)
            
            # UPDATE Plot
            if plot_id:
                update_data = {
                    "plot_name": "Updated Premium Plot",
                    "location": "Bangalore",
                    "plot_area": "400 sq.yds",
                    "price_range": "₹35-45 Lakhs",
                    "property_type": "Commercial",
                    "description": "Updated plot description with commercial potential.",
                    "main_image": test_image_url,
                    "gallery_images": [test_image_url],
                    "youtube_link": "https://youtube.com/watch?v=plotupdated123",
                    "status": "Available",
                    "display_order": 2
                }
                
                response = requests.put(
                    f"{self.api_url}/admin/plots/{plot_id}",
                    json=update_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Plot UPDATE", True, "Plot updated successfully")
                else:
                    self.log_result("Plot UPDATE", False, f"HTTP {response.status_code}", response.text)
            
            # DELETE Plot
            if plot_id:
                response = requests.delete(
                    f"{self.api_url}/admin/plots/{plot_id}",
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Plot DELETE", True, "Plot deleted successfully")
                else:
                    self.log_result("Plot DELETE", False, f"HTTP {response.status_code}", response.text)
                    
        except Exception as e:
            self.log_result("Plot CRUD", False, f"Error: {str(e)}")
    
    def test_budget_homes_public_api(self):
        """Test Budget Homes public API endpoints."""
        try:
            # Test public budget homes listing
            response = requests.get(f"{self.api_url}/budget-homes", timeout=10)
            
            if response.status_code == 200:
                homes = response.json()
                self.log_result("Budget Homes Public Listing", True, f"Retrieved {len(homes)} budget homes")
                
                # Test filtering
                filter_response = requests.get(
                    f"{self.api_url}/budget-homes?location=Hyderabad&property_type=Villa&status=Available",
                    timeout=10
                )
                
                if filter_response.status_code == 200:
                    filtered_homes = filter_response.json()
                    self.log_result("Budget Homes Filtering", True, f"Filtering works, got {len(filtered_homes)} results")
                else:
                    self.log_result("Budget Homes Filtering", False, f"HTTP {filter_response.status_code}", filter_response.text)
                
                # Test budget home detail if homes exist
                if homes:
                    home_id = homes[0].get("_id")
                    if home_id:
                        detail_response = requests.get(f"{self.api_url}/budget-homes/{home_id}", timeout=10)
                        
                        if detail_response.status_code == 200:
                            home_detail = detail_response.json()
                            self.log_result("Budget Home Detail", True, f"Retrieved budget home detail for ID: {home_id}")
                        else:
                            self.log_result("Budget Home Detail", False, f"HTTP {detail_response.status_code}", detail_response.text)
                    else:
                        self.log_result("Budget Home Detail", False, "No budget home ID found in first home")
                else:
                    self.log_result("Budget Home Detail", False, "No budget homes available to test detail endpoint")
            else:
                self.log_result("Budget Homes Public Listing", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Budget Homes Public API", False, f"Error: {str(e)}")
    
    def test_plots_public_api(self):
        """Test Plots public API endpoints."""
        try:
            # Test public plots listing
            response = requests.get(f"{self.api_url}/plots", timeout=10)
            
            if response.status_code == 200:
                plots = response.json()
                self.log_result("Plots Public Listing", True, f"Retrieved {len(plots)} plots")
                
                # Test filtering
                filter_response = requests.get(
                    f"{self.api_url}/plots?location=Hyderabad&property_type=Residential&status=Available",
                    timeout=10
                )
                
                if filter_response.status_code == 200:
                    filtered_plots = filter_response.json()
                    self.log_result("Plots Filtering", True, f"Filtering works, got {len(filtered_plots)} results")
                else:
                    self.log_result("Plots Filtering", False, f"HTTP {filter_response.status_code}", filter_response.text)
                
                # Test plot detail if plots exist
                if plots:
                    plot_id = plots[0].get("_id")
                    if plot_id:
                        detail_response = requests.get(f"{self.api_url}/plots/{plot_id}", timeout=10)
                        
                        if detail_response.status_code == 200:
                            plot_detail = detail_response.json()
                            self.log_result("Plot Detail", True, f"Retrieved plot detail for ID: {plot_id}")
                        else:
                            self.log_result("Plot Detail", False, f"HTTP {detail_response.status_code}", detail_response.text)
                    else:
                        self.log_result("Plot Detail", False, "No plot ID found in first plot")
                else:
                    self.log_result("Plot Detail", False, "No plots available to test detail endpoint")
            else:
                self.log_result("Plots Public Listing", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Plots Public API", False, f"Error: {str(e)}")
    
    def test_authentication_requirements(self):
        """Test that admin endpoints require authentication."""
        try:
            # Test Budget Homes admin endpoint without auth
            response = requests.get(f"{self.api_url}/admin/budget-homes", timeout=10)
            
            if response.status_code == 401 or response.status_code == 403:
                self.log_result("Budget Homes Auth Required", True, "Admin endpoint properly requires authentication")
            else:
                self.log_result("Budget Homes Auth Required", False, f"Expected 401/403, got {response.status_code}")
            
            # Test Plots admin endpoint without auth
            response = requests.get(f"{self.api_url}/admin/plots", timeout=10)
            
            if response.status_code == 401 or response.status_code == 403:
                self.log_result("Plots Auth Required", True, "Admin endpoint properly requires authentication")
            else:
                self.log_result("Plots Auth Required", False, f"Expected 401/403, got {response.status_code}")
                
        except Exception as e:
            self.log_result("Authentication Requirements", False, f"Error: {str(e)}")
    
    def test_invalid_ids(self):
        """Test error handling for invalid IDs."""
        try:
            # Test invalid budget home ID
            invalid_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but non-existent
            response = requests.get(f"{self.api_url}/budget-homes/{invalid_id}", timeout=10)
            
            if response.status_code == 404:
                self.log_result("Budget Home Invalid ID", True, "Properly returns 404 for non-existent budget home")
            else:
                self.log_result("Budget Home Invalid ID", False, f"Expected 404, got {response.status_code}")
            
            # Test invalid plot ID
            response = requests.get(f"{self.api_url}/plots/{invalid_id}", timeout=10)
            
            if response.status_code == 404:
                self.log_result("Plot Invalid ID", True, "Properly returns 404 for non-existent plot")
            else:
                self.log_result("Plot Invalid ID", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_result("Invalid ID Handling", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests."""
        print("=" * 60)
        print("KMK HOMES BACKEND API TESTING")
        print("=" * 60)
        
        # Test health check first
        self.test_health_check()
        
        # Test authentication
        if not self.test_admin_login():
            print("\n❌ CRITICAL: Admin authentication failed. Cannot proceed with admin tests.")
            return
        
        # Test authentication requirements
        self.test_authentication_requirements()
        
        # Test file upload
        self.test_file_upload()
        
        # Test existing admin CRUD operations
        self.test_home_banners_crud()
        self.test_testimonials_crud()
        
        # Test NEW Budget Homes and Plots CRUD operations
        self.test_budget_homes_crud()
        self.test_plots_crud()
        
        # Test public APIs
        self.test_properties_api()
        self.test_public_endpoints()
        
        # Test NEW Budget Homes and Plots public APIs
        self.test_budget_homes_public_api()
        self.test_plots_public_api()
        
        # Test error handling
        self.test_invalid_ids()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary."""
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.test_results if r["success"])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        
        if failed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)

if __name__ == "__main__":
    tester = KMKHomesAPITester()
    tester.run_all_tests()