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
        self.base_url = "https://home-listing-cms.preview.emergentagent.com"
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
        
        # Test file upload
        self.test_file_upload()
        
        # Test admin CRUD operations
        self.test_home_banners_crud()
        self.test_testimonials_crud()
        
        # Test public APIs
        self.test_properties_api()
        self.test_public_endpoints()
        
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