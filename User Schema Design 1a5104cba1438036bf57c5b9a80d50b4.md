# User Schema Design

In Firebase Firestore, data is organized into **collections** and **documents**. For your application, we'll create a users collection where each document represents a user. The structure will accommodate different roles: user, provider, staff, and admin, each with specific fields.

### **Collection: `users`**

- **Document ID (`userId`)**: Unique identifier for each user. Firestore auto-generates this ID upon document creation.

```tsx
{
  "name": "John Doe", // User's full name. Type: String. Required.
  "phone": "+919876543210", // User's phone number in E.164 format. Type: String. Required. Should be unique.
  "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/your-app-id/o/profilePhotos/johndoe.jpg", // URL to the user's profile photo stored in Firebase Storage. Type: String. Optional.
  "location": "Mumbai", // User's city or location. Type: String. Optional.
  "gender": "male", // User's gender. Type: String. Allowed values: "male", "female", "other". Optional.
  "role": "provider", // User's role in the system. Type: String. Allowed values: "user", "provider", "staff", "admin". Required.
  "createdAt": "Timestamp", // Timestamp of when the user was created. Auto-generated. Type: Timestamp. Required.
  "updatedAt": "Timestamp" // Timestamp of the last update to the user's data. Auto-generated. Type: Timestamp. Required.
}

```

**Notes:**

- **`phone`**: Ensure uniqueness to prevent multiple accounts with the same phone number.
- **`profilePhoto`**: Store the image in Firebase Storage and save the URL here.
- **`createdAt`** and **`updatedAt`**: Use Firestore server timestamps to auto-generate these fields.

### **Role-Specific Fields**

Depending on the user's role, additional fields are required. To maintain a clean and efficient database structure, we'll use **subcollections** for role-specific data.

### **1. Subcollection: `providerDetails` (For Providers)**

**Path**: `/users/{userId}/providerDetails/{providerDetailId}`

```tsx
{
  "email": "provider@example.com", // Provider's email for login. Type: String. Required. Should be unique.
  "passwordHash": "hashed_password", // Hashed password for security. Type: String. Required.
  "businessOwnerName": "Mr. Sharma", // Name of the business owner. Type: String. Required.
  "yearsInBusiness": 5, // Number of years the business has been operational. Type: Integer. Required.
  "businessAddress": "123, ABC Street, Mumbai", // Physical address of the business. Type: String. Required.
  "additionalContacts": ["+911234567890", "+919876543210"], // List of additional contact numbers. Type: Array of Strings. Optional.
  "emergencyContact": "+911234567890", // Emergency contact number available 24/7. Type: String. Required.
  "businessEmail": "contact@provider.com", // Official business email. Type: String. Required.
  "businessGST": "GSTIN12345678", // Business GST Number. Type: String. Optional.
  "businessPAN": "ABCDE1234F", // Business PAN Number. Type: String. Optional.
  "businessHours": "9 AM - 9 PM", // Operating hours for customer queries. Type: String. Optional.
  "citiesServed": ["Mumbai", "Pune", "Delhi"], // List of cities where services are provided. Type: Array of Strings. Required.
  "staffAvailability": {
    "attendants": "11-30", // Number of attendants available. Type: String. Allowed ranges: "1-10", "11-30", "31-50", "51-100". Required.
    "nurses": "31-50", // Number of nurses available. Type: String. Allowed ranges: "1-10", "11-30", "31-50", "51-100". Required.
    "semiNurses": "1-10" // Number of semi-nurses available. Type: String. Allowed ranges: "1-10", "11-30", "31-50", "51-100". Required.
  },
  "customersServedLast3Months": 500, // Number of customers served in the last 3 months. Type: Integer. Optional.
  "charges": {
    "attendant": {
      "6hr": 300, // Charges for a 6-hour shift. Type: Integer. Required.
      "12hr": 500, // Charges for a 12-hour shift. Type: Integer. Required.
      "24hr": 800 // Charges for a 24-hour shift. Type: Integer. Required.
    },
    "nurse": {
      "6hr": 600, // Charges for a 6-hour shift. Type: Integer. Required.
      "12hr": 1000, // Charges for a 12-hour shift. Type: Integer. Required.
      "24hr": 1500 // Charges for a 24-hour shift. Type: Integer. Required.
    },
    "semiNurse": {
      "6hr": 450, // Charges for a 6-hour shift. Type: Integer. Required.
      "12hr": 800, // Charges for a 12-hour shift. Type: Integer. Required.
      "24hr": 1200 // Charges for a 24-hour shift. Type: Integer. Required.
    }
  },
  "availabilityDurations": {
    "attendant": "2 weeks", // Duration for which attendants are available. Type: String. Allowed values: "3days/week", "5days/week", "1 week", "2 weeks", "4 weeks+". Required.
    "nurse": "4 weeks+", // Duration for which nurses are available. Type: String. Allowed values: "3days/week", "5days/week", "1 week", "2 weeks", "4 weeks+". Required.
    "semiNurse": "1 week" // Duration for which semi-nurses are available. Type: String. Allowed values: "3days/week", "5days/week", "1 week", "2 weeks", "4 weeks+". Required.
  },
  "replacementTime": "24hrs", // Time to provide a replacement. Type: String. Allowed values: "12hrs", "24hrs", "48hrs". Required.
  "serviceTimeRequirement": "48hrs", // Time required to provide nurses/attendants. Type: String. Optional.
  "extraInfo": "We provide specialized elderly care services.",
  "servicesOffered": [
    "Emergency Services",
    "Help with Doctor Visits",
    "Cab Booking",
    "Milk/Tea Preparation",
    "Washroom Cleaning",
    "Massage",
    "Laundry",
    "Grocery Buying"
  ]
}

```

## **Subcollection: `staffDetails` (For Staff Members)**

**Path**: `/users/{userId}/staffDetails/{staffDetailId}`

Each staff member has specific attributes pertinent to their role. Storing these details in a subcollection under the `users` collection ensures organized and scalable data management.

### **Schema Structure**

```tsx
{
  "providerId": "provider123", // Identifier linking the staff to a provider. Type: String. Required. If the staff is independent, use "self".
  "expectedWages": {
    "5hrs": 500, // Expected wages for a 5-hour shift. Type: Integer. Optional.
    "12hrs": 1200, // Expected wages for a 12-hour shift. Type: Integer. Optional.
    "24hrs": 2500 // Expected wages for a 24-hour shift. Type: Integer. Optional.
  },
  "educationQualification": "B.Sc Nursing", // Highest education qualification. Type: String. Required.
  "educationCertificate": "https://firebasestorage.googleapis.com/v0/b/nurch-app/o/docs/certificate.pdf", // URL to education certificate (image or PDF). Type: String. Required.
  "experienceYears": 8, // Years of experience in the field. Type: Integer. Required.
  "maritalStatus": "married", // Marital status of the staff. Type: String. Allowed values: "single", "divorced", "married", "widowed". Required.
  "languagesKnown": ["Hindi", "English", "Marathi"], // List of languages the staff can speak. Type: Array of Strings. Required.
  "preferredShifts": [
    "Morning Shift (6 AM - 2 PM)",
    "Night Shift (10 PM - 6 AM)"
  ], // List of preferred shifts. Type: Array of Strings. Allowed values: ["Morning Shift (6 AM - 2 PM)", "Afternoon Shift (2 PM - 10 PM)", "Night Shift (10 PM - 6 AM)", "Full Day (9 AM - 6 PM)", "Part Time", "Flexible Hours"]. Required.
  "jobRole": "nurse", // Staff's job role. Type: String. Allowed values: "attendant", "nurse", "semi-nurse". Required.
  "extraServicesOffered": [
    "Can shave the beard of customer",
    "Help with changing medical dressing",
    "Measuring vitals - BP, Sugar etc.",
    "Bathing & sponge the customer"
  ], // List of extra services the staff is capable of providing. Type: Array of Strings. Optional.
  "foodPreference": "veg", // Staff's food preference. Type: String. Allowed values: "veg", "non-veg". Required.
  "smokes": "no", // Whether the staff smokes. Type: String. Allowed values: "yes", "no". Required.
  "carryOwnFood12hrs": "yes", // Whether the staff will bring their own food for a 12-hour duty. Type: String. Allowed values: "yes", "no". Required.
  "additionalInfo": "Willing to work night shifts", // Any additional information provided by the staff. Type: String. Optional.
  "selfTestimonial": {
    "customerName": "Ramesh Gupta",
    "customerPhone": "+919898989898",
    "recording": "https://firebasestorage.googleapis.com/v0/b/nurch-app/o/testimonials/audio.mp3"
  }, // Self-submitted testimonial from a previous customer. Type: Object with fields "customerName" (String), "customerPhone" (String), and "recording" (String URL). Optional.
  "identityDocuments": {
    "aadharNumber": "123456789012", // Aadhar card number. Type: String. Required.
    "aadharFront": "https://firebasestorage.googleapis.com/v0/b/nurch-app/o/docs/aadhar_front.jpg", // URL to the front side of the Aadhar card. Type: String. Required.
    "aadharBack": "https://firebasestorage.googleapis.com/v0/b/nurch-app/o/docs/aadhar_back.jpg", // URL to the back side of the Aadhar card. Type: String. Required.
    "panNumber": "ABCDE1234F", // PAN card number. Type: String. Optional.
    "panDocument": "https://firebasestorage.googleapis.com/v0/b/nurch-app/o/docs/pan_card.jpg" // URL to the PAN card document. Type: String. Optional.
  }
}

```

### **🔥 Explanation of the Schema**

1. **General Information**
    - `providerId`: Links the staff to a provider. If they work independently, use `"self"`.
    - `expectedWages`: Stores expected wages for different shift durations.
    - `educationQualification` & `educationCertificate`: Captures the highest education qualification and document verification.
    - `experienceYears`: Specifies the number of years of work experience.
    - `maritalStatus`: Captures personal details that may impact work scheduling.
2. **Job Preferences**
    - `languagesKnown`: List of languages spoken.
    - `preferredShifts`: Specifies shift preferences.
    - `jobRole`: Defines whether the staff is an "attendant", "nurse", or "semi-nurse".
    - `extraServicesOffered`: Lists additional services that the staff can provide.
3. **Personal Preferences**
    - `foodPreference`: Specifies dietary preferences.
    - `smokes`: Captures whether the staff smokes.
    - `carryOwnFood12hrs`: Defines if the staff will bring their own food for long shifts.
4. **Additional Information**
    - `additionalInfo`: Optional field for extra remarks.
    - `selfTestimonial`: Allows staff to submit testimonials from past customers.
5. **Identity Verification**
    - `identityDocuments`: Stores personal identification details including **Aadhar & PAN details**.
    - **Aadhar** is mandatory, while **PAN is optional**.