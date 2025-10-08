#!/usr/bin/env python3
"""
Specific tests for the issues mentioned in the review request
"""

import requests
import json

def test_specific_issues():
    base_url = "https://home-listing-cms.preview.emergentagent.com/api"
    
    print("Testing specific issues mentioned in review request...")
    print("=" * 60)
    
    # 1. Test admin login with existing credentials
    print("1. Testing admin authentication...")
    login_response = requests.post(f"{base_url}/admin/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Admin login successful")
    else:
        print("❌ Admin login failed")
        return
    
    # 2. Test file upload and accessibility
    print("\n2. Testing file upload and accessibility...")
    
    # Create a test file
    test_content = b"test image content"
    files = {'file': ('test.jpg', test_content, 'image/jpeg')}
    
    upload_response = requests.post(f"{base_url}/admin/upload", files=files, headers=headers)
    
    if upload_response.status_code == 200:
        upload_data = upload_response.json()
        file_url = upload_data["file_url"]
        print(f"✅ File upload successful: {upload_data['filename']}")
        
        # Test file accessibility
        file_check = requests.get(file_url)
        if file_check.status_code == 200:
            print("✅ Uploaded file is accessible")
        else:
            print(f"❌ Uploaded file not accessible: HTTP {file_check.status_code}")
    else:
        print(f"❌ File upload failed: HTTP {upload_response.status_code}")
    
    # 3. Test properties listing
    print("\n3. Testing properties listing...")
    props_response = requests.get(f"{base_url}/properties")
    
    if props_response.status_code == 200:
        properties = props_response.json()
        print(f"✅ Properties listing working: {len(properties)} properties found")
        
        # 4. Test property detail for each property
        print("\n4. Testing property detail endpoints...")
        for i, prop in enumerate(properties[:3]):  # Test first 3 properties
            prop_id = prop.get("_id")
            if prop_id:
                detail_response = requests.get(f"{base_url}/properties/{prop_id}")
                if detail_response.status_code == 200:
                    print(f"✅ Property detail working for ID: {prop_id}")
                else:
                    print(f"❌ Property detail failed for ID: {prop_id} - HTTP {detail_response.status_code}")
            else:
                print(f"❌ Property {i+1} has no _id field")
    else:
        print(f"❌ Properties listing failed: HTTP {props_response.status_code}")
    
    # 5. Test admin banners CRUD
    print("\n5. Testing Admin Banners CRUD...")
    
    # Create banner
    banner_data = {
        "title": "Test Banner",
        "subtitle": "Test Subtitle", 
        "image_url": "https://example.com/banner.jpg",
        "cta_text": "Click Here",
        "cta_link": "/test",
        "display_order": 1
    }
    
    create_response = requests.post(f"{base_url}/admin/home-banners", json=banner_data, headers=headers)
    if create_response.status_code == 200:
        banner_id = create_response.json()["id"]
        print(f"✅ Banner creation successful: {banner_id}")
        
        # Test GET
        get_response = requests.get(f"{base_url}/admin/home-banners", headers=headers)
        if get_response.status_code == 200:
            print("✅ Banner GET successful")
        else:
            print(f"❌ Banner GET failed: HTTP {get_response.status_code}")
        
        # Test PUT
        banner_data["title"] = "Updated Banner"
        put_response = requests.put(f"{base_url}/admin/home-banners/{banner_id}", json=banner_data, headers=headers)
        if put_response.status_code == 200:
            print("✅ Banner UPDATE successful")
        else:
            print(f"❌ Banner UPDATE failed: HTTP {put_response.status_code}")
        
        # Test DELETE
        delete_response = requests.delete(f"{base_url}/admin/home-banners/{banner_id}", headers=headers)
        if delete_response.status_code == 200:
            print("✅ Banner DELETE successful")
        else:
            print(f"❌ Banner DELETE failed: HTTP {delete_response.status_code}")
    else:
        print(f"❌ Banner creation failed: HTTP {create_response.status_code}")
    
    # 6. Test admin testimonials CRUD
    print("\n6. Testing Admin Testimonials CRUD...")
    
    testimonial_data = {
        "name": "Test User",
        "location": "Test City",
        "testimonial": "Great experience!",
        "image_url": "https://example.com/user.jpg",
        "rating": 5,
        "featured": True,
        "display_order": 1
    }
    
    create_response = requests.post(f"{base_url}/admin/testimonials", json=testimonial_data, headers=headers)
    if create_response.status_code == 200:
        testimonial_id = create_response.json()["id"]
        print(f"✅ Testimonial creation successful: {testimonial_id}")
        
        # Test GET
        get_response = requests.get(f"{base_url}/admin/testimonials", headers=headers)
        if get_response.status_code == 200:
            print("✅ Testimonial GET successful")
        else:
            print(f"❌ Testimonial GET failed: HTTP {get_response.status_code}")
        
        # Test PUT
        testimonial_data["name"] = "Updated User"
        put_response = requests.put(f"{base_url}/admin/testimonials/{testimonial_id}", json=testimonial_data, headers=headers)
        if put_response.status_code == 200:
            print("✅ Testimonial UPDATE successful")
        else:
            print(f"❌ Testimonial UPDATE failed: HTTP {put_response.status_code}")
        
        # Test DELETE
        delete_response = requests.delete(f"{base_url}/admin/testimonials/{testimonial_id}", headers=headers)
        if delete_response.status_code == 200:
            print("✅ Testimonial DELETE successful")
        else:
            print(f"❌ Testimonial DELETE failed: HTTP {delete_response.status_code}")
    else:
        print(f"❌ Testimonial creation failed: HTTP {create_response.status_code}")
    
    print("\n" + "=" * 60)
    print("Specific testing complete!")

if __name__ == "__main__":
    test_specific_issues()