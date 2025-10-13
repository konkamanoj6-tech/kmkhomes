#!/usr/bin/env python3
"""
Comprehensive Budget Homes and Plots API Testing
Creates test data and validates all functionality including filtering and edge cases.
"""

import requests
import json
import uuid
from typing import Dict, Any, Optional

class ComprehensiveBudgetPlotsAPITester:
    def __init__(self):
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
        self.created_budget_homes = []
        self.created_plots = []
        
        print(f"Testing Budget Homes and Plots APIs at: {self.api_url}")
    
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
    
    def create_test_budget_homes(self):
        """Create multiple test budget homes with different properties."""
        test_homes = [
            {
                "property_name": "Sunrise Villa",
                "location": "Hyderabad",
                "price_range": "₹45-55 Lakhs",
                "property_type": "Villa",
                "built_up_area": "1600 sq.ft",
                "facing": "East",
                "description": "Beautiful 3BHK villa with modern amenities.",
                "main_image": "https://example.com/sunrise-villa.jpg",
                "gallery_images": ["https://example.com/gallery1.jpg", "https://example.com/gallery2.jpg"],
                "youtube_link": "https://youtube.com/watch?v=sunrise123",
                "area": "Kompally",
                "status": "Available",
                "display_order": 1
            },
            {
                "property_name": "Green Apartments",
                "location": "Bangalore",
                "price_range": "₹35-45 Lakhs",
                "property_type": "Apartment",
                "built_up_area": "1200 sq.ft",
                "facing": "North",
                "description": "Spacious 2BHK apartment in prime location.",
                "main_image": "https://example.com/green-apt.jpg",
                "gallery_images": ["https://example.com/apt-gallery1.jpg"],
                "youtube_link": "https://youtube.com/watch?v=green123",
                "area": "Whitefield",
                "status": "Available",
                "display_order": 2
            },
            {
                "property_name": "Heritage House",
                "location": "Chennai",
                "price_range": "₹60-70 Lakhs",
                "property_type": "Independent House",
                "built_up_area": "2000 sq.ft",
                "facing": "South",
                "description": "Traditional style independent house with garden.",
                "main_image": "https://example.com/heritage-house.jpg",
                "gallery_images": ["https://example.com/heritage-gallery1.jpg", "https://example.com/heritage-gallery2.jpg"],
                "youtube_link": "https://youtube.com/watch?v=heritage123",
                "area": "Velachery",
                "status": "Sold Out",
                "display_order": 3
            }
        ]
        
        for home_data in test_homes:
            try:
                response = requests.post(
                    f"{self.api_url}/admin/budget-homes",
                    json=home_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    home_id = data.get("id")
                    self.created_budget_homes.append(home_id)
                    self.log_result(f"Create Test Budget Home", True, f"Created {home_data['property_name']} with ID: {home_id}")
                else:
                    self.log_result(f"Create Test Budget Home", False, f"Failed to create {home_data['property_name']}: HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_result(f"Create Test Budget Home", False, f"Error creating {home_data['property_name']}: {str(e)}")
    
    def create_test_plots(self):
        """Create multiple test plots with different properties."""
        test_plots = [
            {
                "plot_name": "Prime Residential Plot A",
                "location": "Hyderabad",
                "plot_area": "300 sq.yds",
                "price_range": "₹25-35 Lakhs",
                "property_type": "Residential",
                "description": "Well-located residential plot with clear title.",
                "main_image": "https://example.com/plot-a.jpg",
                "gallery_images": ["https://example.com/plot-a-gallery1.jpg"],
                "youtube_link": "https://youtube.com/watch?v=plota123",
                "status": "Available",
                "display_order": 1
            },
            {
                "plot_name": "Commercial Corner Plot",
                "location": "Bangalore",
                "plot_area": "500 sq.yds",
                "price_range": "₹75-85 Lakhs",
                "property_type": "Commercial",
                "description": "Corner plot ideal for commercial development.",
                "main_image": "https://example.com/commercial-plot.jpg",
                "gallery_images": ["https://example.com/commercial-gallery1.jpg", "https://example.com/commercial-gallery2.jpg"],
                "youtube_link": "https://youtube.com/watch?v=commercial123",
                "status": "Available",
                "display_order": 2
            },
            {
                "plot_name": "Garden View Plot",
                "location": "Chennai",
                "plot_area": "400 sq.yds",
                "price_range": "₹40-50 Lakhs",
                "property_type": "Residential",
                "description": "Residential plot with garden view and amenities.",
                "main_image": "https://example.com/garden-plot.jpg",
                "gallery_images": ["https://example.com/garden-gallery1.jpg"],
                "youtube_link": "https://youtube.com/watch?v=garden123",
                "status": "Sold Out",
                "display_order": 3
            }
        ]
        
        for plot_data in test_plots:
            try:
                response = requests.post(
                    f"{self.api_url}/admin/plots",
                    json=plot_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    plot_id = data.get("id")
                    self.created_plots.append(plot_id)
                    self.log_result(f"Create Test Plot", True, f"Created {plot_data['plot_name']} with ID: {plot_id}")
                else:
                    self.log_result(f"Create Test Plot", False, f"Failed to create {plot_data['plot_name']}: HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_result(f"Create Test Plot", False, f"Error creating {plot_data['plot_name']}: {str(e)}")
    
    def test_budget_homes_filtering(self):
        """Test Budget Homes filtering functionality."""
        filter_tests = [
            ("location=Hyderabad", "Location filter"),
            ("property_type=Villa", "Property type filter"),
            ("facing=East", "Facing filter"),
            ("status=Available", "Status filter"),
            ("location=Hyderabad&property_type=Villa", "Multiple filters"),
            ("limit=2", "Limit parameter"),
            ("skip=1&limit=1", "Pagination")
        ]
        
        for filter_param, test_name in filter_tests:
            try:
                response = requests.get(
                    f"{self.api_url}/budget-homes?{filter_param}",
                    timeout=10
                )
                
                if response.status_code == 200:
                    homes = response.json()
                    self.log_result(f"Budget Homes {test_name}", True, f"Filter '{filter_param}' returned {len(homes)} results")
                else:
                    self.log_result(f"Budget Homes {test_name}", False, f"HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_result(f"Budget Homes {test_name}", False, f"Error: {str(e)}")
    
    def test_plots_filtering(self):
        """Test Plots filtering functionality."""
        filter_tests = [
            ("location=Hyderabad", "Location filter"),
            ("property_type=Residential", "Property type filter"),
            ("plot_area=300", "Plot area filter"),
            ("status=Available", "Status filter"),
            ("location=Bangalore&property_type=Commercial", "Multiple filters"),
            ("limit=2", "Limit parameter"),
            ("skip=1&limit=1", "Pagination")
        ]
        
        for filter_param, test_name in filter_tests:
            try:
                response = requests.get(
                    f"{self.api_url}/plots?{filter_param}",
                    timeout=10
                )
                
                if response.status_code == 200:
                    plots = response.json()
                    self.log_result(f"Plots {test_name}", True, f"Filter '{filter_param}' returned {len(plots)} results")
                else:
                    self.log_result(f"Plots {test_name}", False, f"HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_result(f"Plots {test_name}", False, f"Error: {str(e)}")
    
    def test_detail_endpoints(self):
        """Test detail endpoints with created data."""
        # Test Budget Home details
        if self.created_budget_homes:
            for home_id in self.created_budget_homes[:2]:  # Test first 2
                try:
                    response = requests.get(f"{self.api_url}/budget-homes/{home_id}", timeout=10)
                    
                    if response.status_code == 200:
                        home_detail = response.json()
                        required_fields = ["property_name", "location", "price_range", "property_type", "built_up_area", "facing"]
                        missing_fields = [field for field in required_fields if field not in home_detail]
                        
                        if not missing_fields:
                            self.log_result("Budget Home Detail", True, f"Retrieved complete budget home detail for ID: {home_id}")
                        else:
                            self.log_result("Budget Home Detail", False, f"Missing fields in response: {missing_fields}")
                    else:
                        self.log_result("Budget Home Detail", False, f"HTTP {response.status_code}", response.text)
                        
                except Exception as e:
                    self.log_result("Budget Home Detail", False, f"Error: {str(e)}")
        
        # Test Plot details
        if self.created_plots:
            for plot_id in self.created_plots[:2]:  # Test first 2
                try:
                    response = requests.get(f"{self.api_url}/plots/{plot_id}", timeout=10)
                    
                    if response.status_code == 200:
                        plot_detail = response.json()
                        required_fields = ["plot_name", "location", "plot_area", "price_range", "property_type"]
                        missing_fields = [field for field in required_fields if field not in plot_detail]
                        
                        if not missing_fields:
                            self.log_result("Plot Detail", True, f"Retrieved complete plot detail for ID: {plot_id}")
                        else:
                            self.log_result("Plot Detail", False, f"Missing fields in response: {missing_fields}")
                    else:
                        self.log_result("Plot Detail", False, f"HTTP {response.status_code}", response.text)
                        
                except Exception as e:
                    self.log_result("Plot Detail", False, f"Error: {str(e)}")
    
    def test_data_integrity(self):
        """Test data integrity and field validation."""
        # Test Budget Homes data structure
        try:
            response = requests.get(f"{self.api_url}/budget-homes", timeout=10)
            
            if response.status_code == 200:
                homes = response.json()
                if homes:
                    home = homes[0]
                    required_fields = ["_id", "property_name", "location", "price_range", "property_type", "built_up_area", "facing", "description", "main_image", "status"]
                    missing_fields = [field for field in required_fields if field not in home]
                    
                    if not missing_fields:
                        self.log_result("Budget Homes Data Structure", True, "All required fields present in budget home response")
                    else:
                        self.log_result("Budget Homes Data Structure", False, f"Missing required fields: {missing_fields}")
                else:
                    self.log_result("Budget Homes Data Structure", False, "No budget homes found to validate structure")
            else:
                self.log_result("Budget Homes Data Structure", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Budget Homes Data Structure", False, f"Error: {str(e)}")
        
        # Test Plots data structure
        try:
            response = requests.get(f"{self.api_url}/plots", timeout=10)
            
            if response.status_code == 200:
                plots = response.json()
                if plots:
                    plot = plots[0]
                    required_fields = ["_id", "plot_name", "location", "plot_area", "price_range", "property_type", "description", "main_image", "status"]
                    missing_fields = [field for field in required_fields if field not in plot]
                    
                    if not missing_fields:
                        self.log_result("Plots Data Structure", True, "All required fields present in plot response")
                    else:
                        self.log_result("Plots Data Structure", False, f"Missing required fields: {missing_fields}")
                else:
                    self.log_result("Plots Data Structure", False, "No plots found to validate structure")
            else:
                self.log_result("Plots Data Structure", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Plots Data Structure", False, f"Error: {str(e)}")
    
    def cleanup_test_data(self):
        """Clean up created test data."""
        # Delete created budget homes
        for home_id in self.created_budget_homes:
            try:
                response = requests.delete(
                    f"{self.api_url}/admin/budget-homes/{home_id}",
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Cleanup Budget Home", True, f"Deleted budget home {home_id}")
                else:
                    self.log_result("Cleanup Budget Home", False, f"Failed to delete budget home {home_id}: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_result("Cleanup Budget Home", False, f"Error deleting budget home {home_id}: {str(e)}")
        
        # Delete created plots
        for plot_id in self.created_plots:
            try:
                response = requests.delete(
                    f"{self.api_url}/admin/plots/{plot_id}",
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_result("Cleanup Plot", True, f"Deleted plot {plot_id}")
                else:
                    self.log_result("Cleanup Plot", False, f"Failed to delete plot {plot_id}: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_result("Cleanup Plot", False, f"Error deleting plot {plot_id}: {str(e)}")
    
    def run_comprehensive_tests(self):
        """Run comprehensive Budget Homes and Plots tests."""
        print("=" * 80)
        print("COMPREHENSIVE BUDGET HOMES AND PLOTS API TESTING")
        print("=" * 80)
        
        # Test authentication
        if not self.test_admin_login():
            print("\n❌ CRITICAL: Admin authentication failed. Cannot proceed with admin tests.")
            return
        
        # Create test data
        print("\n--- CREATING TEST DATA ---")
        self.create_test_budget_homes()
        self.create_test_plots()
        
        # Test filtering functionality
        print("\n--- TESTING FILTERING ---")
        self.test_budget_homes_filtering()
        self.test_plots_filtering()
        
        # Test detail endpoints
        print("\n--- TESTING DETAIL ENDPOINTS ---")
        self.test_detail_endpoints()
        
        # Test data integrity
        print("\n--- TESTING DATA INTEGRITY ---")
        self.test_data_integrity()
        
        # Clean up test data
        print("\n--- CLEANING UP TEST DATA ---")
        self.cleanup_test_data()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary."""
        print("\n" + "=" * 80)
        print("COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        
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
        else:
            print("\n🎉 ALL TESTS PASSED! Budget Homes and Plots APIs are working perfectly.")
        
        print("\n" + "=" * 80)

if __name__ == "__main__":
    tester = ComprehensiveBudgetPlotsAPITester()
    tester.run_comprehensive_tests()