export default function Resume() {
  return (
    <div className="max-w-4xl mx-auto p-8 font-sans text-gray-900 bg-white">
      <h1 className="text-4xl font-bold text-center mb-2">Deepak</h1>
      <p className="text-center text-sm mb-4">
        Email:{" "}
        <a href="mailto:singhdeepak350@gmail.com" className="text-blue-600">
          singhdeepak350@gmail.com
        </a>
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b pb-1">Education</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Delhi Technological University</strong> – B.Tech in
            Electrical Engineering (2021 - 2025)
          </li>
          <li>
            <strong>Class 12:</strong> New Horizon School (CBSE), 2020 – 94.6%
          </li>
          <li>
            <strong>Class 10:</strong> New Horizon School (CBSE), 2018 – 91.2%
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b pb-1">
          Technical Skills
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Languages: C, C++, JavaScript, TypeScript</li>
          <li>Frontend: HTML, CSS, React, Next.js, Tailwind CSS</li>
          <li>Backend: Node.js, Express.js</li>
          <li>Database: MongoDB, Firebase</li>
          <li>Tools: Git, GitHub, VS Code, Figma, Postman</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b pb-1">Projects</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Next.js Portfolio Website</h3>
            <p>
              Built a responsive portfolio using Next.js, showcasing personal
              projects, skills, and contact form integration.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Chat Application</h3>
            <p>
              Developed a real-time chat app using Node.js, Socket.io, and
              MongoDB; included user authentication and message persistence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Swiggy Invoice Generator</h3>
            <p>
              Created a web tool to generate Swiggy-like invoices using React
              and html2pdf.js for PDF downloads.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b pb-1">
          Achievements & Positions
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Top 5 finalist in DTU Hackathon 2023</li>
          <li>
            Team lead for Kartavyapath education initiative, handling tech
            support and team coordination
          </li>
          <li>Led 4-member team in multiple web development projects</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b pb-1">Languages</h2>
        <p>English, Hindi, Urdu</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 border-b pb-1">Interests</h2>
        <p>
          Web Development, Problem Solving, Tech Events, Car Enthusiast,
          Clubbing
        </p>
      </section>
    </div>
  );
}
