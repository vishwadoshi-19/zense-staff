# Provider/Agency App Plan

## 1. Project Setup

- **Initialize Next.js Project**:
  ```bash
  npx create-next-app@latest nurch-provider-app --typescript
  cd nurch-provider-app
  ```
- **Install Dependencies**:
  ```bash
  npm install tailwindcss shadcn-ui firebase
  ```

## 2. Folder Structure

Here's a detailed folder structure for the project:

```
nurch-provider-app/
├── public/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── AuthContext.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StaffList.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── AttendanceTracker.tsx
│   │   │   └── Profile.tsx
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── LoadingSpinner.tsx
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login.ts
│   │   │   │   ├── signup.ts
│   │   │   │   └── logout.ts
│   │   │   ├── providers/
│   │   │   │   ├── [id].ts
│   │   │   ├── staff/
│   │   │   │   ├── index.ts
│   │   │   │   ├── [id].ts
│   │   │   ├── jobs/
│   │   │   │   ├── index.ts
│   │   │   │   ├── [id].ts
│   │   │   ├── attendance/
│   │   │   │   ├── index.ts
│   │   │   │   ├── [id].ts
│   │   ├── index.tsx
│   │   ├── dashboard.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── profile.tsx
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── utils/
│   │   ├── firebase.ts
│   │   └── api.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── user.ts
├── .env
├── .gitignore
├── tailwind.config.js
├── next.config.js
├── package.json
└── tsconfig.json
```

## 3. UI/Layout Design

- **Header**: Contains navigation links and user profile dropdown.
- **Sidebar**: Contains links to different sections like Dashboard, Manage Staff, Assign Jobs, Track Availability, Track Work, Profile, and Contact Details.
- **Footer**: Contains company information and links to privacy policy and terms of service.
- **Dashboard**: Overview of staff, jobs, and attendance.
- **Manage Staff**: List of staff with options to add, update, and delete staff.
- **Assign Jobs**: Interface to assign jobs to staff.
- **Track Availability**: Real-time tracking of staff availability.
- **Track Work**: Interface to track clock-in/clock-out times and attendance.
- **Profile**: View and update provider profile.
- **Contact Details**: Manage provider contact information.

## 4. Detailed Feature Implementation

### Authentication

- **LoginForm.tsx**: Form for provider login.
- **SignupForm.tsx**: Form for provider signup.
- **AuthContext.tsx**: Context to manage authentication state.

### Dashboard

- **Dashboard.tsx**: Main dashboard component.
- **StaffList.tsx**: List of staff with management options.
- **JobList.tsx**: List of jobs with assignment options.
- **AttendanceTracker.tsx**: Track staff attendance.
- **Profile.tsx**: View and update provider profile.

### Common Components

- **Header.tsx**: Header component with navigation.
- **Footer.tsx**: Footer component with company information.
- **Sidebar.tsx**: Sidebar component with navigation links.
- **LoadingSpinner.tsx**: Loading spinner for asynchronous operations.

## 5. API Routes

### Auth Routes

- **POST `/api/auth/login`**: Handle provider login.
- **POST `/api/auth/signup`**: Handle provider signup.
- **POST `/api/auth/logout`**: Handle provider logout.

### Provider Routes

- **GET `/api/providers/:id`**: Fetch provider details.
- **PUT `/api/providers/:id`**: Update provider details.
- **DELETE `/api/providers/:id`**: Delete a provider.

### Staff Routes

- **GET `/api/staff`**: Fetch all staff.
- **POST `/api/staff`**: Add new staff.
- **PUT `/api/staff/:id`**: Update staff details.
- **DELETE `/api/staff/:id`**: Delete staff.

### Job Routes

- **GET `/api/jobs`**: Fetch all jobs.
- **POST `/api/jobs`**: Create a new job.
- **PUT `/api/jobs/:id`**: Update job details.
- **DELETE `/api/jobs/:id`**: Delete a job.
- **POST `/api/jobs/:id/assign`**: Assign a job to a staff member.
- **PUT `/api/jobs/:id/status`**: Update job status (accepted/declined).

### Attendance Routes

- **GET `/api/attendance`**: Fetch attendance records.
- **POST `/api/attendance`**: Add new attendance record.
- **PUT `/api/attendance/:id`**: Update attendance record.
- **DELETE `/api/attendance/:id`**: Delete attendance record.

## 6. Testing and Deployment

- **Testing**: Write unit and integration tests using Jest and React Testing Library.
- **Deployment**: Deploy the app using Vercel or Firebase Hosting.

## 7. Theme and Design

To maintain consistency with the staff dashboard, we will use the same color palette, fonts, and overall design aesthetics.

### Color Palette

- **Primary Color**: #1E3A8A (Indigo)
- **Secondary Color**: #3B82F6 (Blue)
- **Accent Color**: #10B981 (Green)
- **Background Color**: #F3F4F6 (Gray)
- **Text Color**: #111827 (Dark Gray)

### Fonts

- **Primary Font**: Inter, sans-serif
- **Secondary Font**: Roboto, sans-serif

### Design Aesthetics

- **Consistent Spacing**: Use consistent spacing and padding throughout the app.
- **Responsive Design**: Ensure the app is fully responsive and works well on all devices.
- **Clean and Minimalistic**: Maintain a clean and minimalistic design to enhance user experience.

### Provider Onboarding Form Fields (Updated)

1. **Business Information**

   - Business Name
   - Business Owner's Name
   - Years in Business
   - Business Address
   - Contact Number(s)
   - Emergency Contact Numbers (24x7)
   - Business Email ID
   - Business PAN Number
   - Business GST Number
   - Business Hours (for Customer Query)
   - Cities Where Service is Provided

2. **Staff Information**

   - Number of Attendants Available
   - Number of Nurses Available
   - Number of Semi-Nurses Available
   - Customers Served in Last 3 Months

3. **Charges Information**

   - Attendant Charges (for 24 Hour Shift, for 30+ days)
   - Attendant Charges (for 12 Hour Shift, for 30+ days)
   - Attendant Charges (for 6 Hour Shift, for 30+ days)
   - Semi-Nurse Charges (for 24 Hour Shift, for 30+ days)
   - Semi-Nurse Charges (for 12 Hour Shift, for 30+ days)
   - Semi-Nurse Charges (for 6 Hour Shift, for 30+ days)
   - Nurse Charges (for 24 Hour Shift, for 30+ days)
   - Nurse Charges (for 12 Hour Shift, for 30+ days)
   - Nurse Charges (for 6 Hour Shift, for 30+ days)

4. **Availability Information**

   - Duration for which Attendant is Available
   - Duration for which Semi-Nurse is Available
   - Duration for which Nurse is Available

5. **Additional Information**
   - Services Offered by Attendants (other than Patient Care)
   - Time to Provide Replacement
   - Time Required to provide nurses/attendants
   - Extra information you would like to add
