import type { ResumeData } from "@/types/resume";

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alex Morgan",
    linkedinUrl: "https://linkedin.com/in/alex-morgan-data",
    portfolioUrl: "https://alexmorgan.dev",
    phone: "+49 151 23456789",
    city: "Berlin",
    country: "Germany",
    email: "alex.morgan@email.com",
  },
  profile: {
    summaryText:
      "Data engineer with 5+ years of experience building scalable data pipelines and analytics platforms across fintech and e-commerce sectors. Proficient in Python, SQL, and cloud-native data tools with a focus on delivering clean, well-documented infrastructure.",
  },
  skills: [
    {
      id: "skill-data-engineering",
      categoryName: "Data Engineering",
      skills: "Python, SQL, dbt, Apache Spark, Airflow, Kafka",
    },
    {
      id: "skill-cloud-tools",
      categoryName: "Cloud & Tools",
      skills: "Snowflake, BigQuery, AWS S3, Docker, Git, Looker",
    },
  ],
  experience: [
    {
      id: "work-fintech-gmbh",
      jobTitle: "Senior Data Engineer",
      companyName: "FinTech GmbH",
      startDate: "April 2023",
      endDate: "",
      isCurrent: true,
      location: "Berlin, Germany",
      bulletPoints: [
        "Architected a real-time data pipeline processing 2M+ events/day using Kafka and Spark",
        "Reduced data warehouse query costs by 35% through optimised dbt model refactoring",
      ],
    },
    {
      id: "work-retailco-ag",
      jobTitle: "Data Analyst",
      companyName: "RetailCo AG",
      startDate: "August 2019",
      endDate: "September 2022",
      isCurrent: false,
      location: "Hamburg, Germany",
      bulletPoints: [
        "Built automated reporting dashboards in Looker serving 8 business units",
        "Standardised KPI definitions across 3 product teams, reducing reporting discrepancies",
      ],
    },
    {
      id: "work-softcorp-india",
      jobTitle: "Associate Developer",
      companyName: "SoftCorp India",
      startDate: "June 2018",
      endDate: "June 2019",
      isCurrent: false,
      location: "Bangalore, India",
      bulletPoints: ["Developed REST APIs for internal tooling using Django and PostgreSQL"],
    },
  ],
  education: [
    {
      id: "edu-msc-tu-berlin",
      degreeType: "Master of Science",
      fieldOfStudy: "Data Science",
      institution: "TU Berlin",
      location: "Berlin",
      startYear: "2020",
      endYear: "2022",
    },
    {
      id: "edu-be-vtu",
      degreeType: "Bachelor of Engineering",
      fieldOfStudy: "Computer Science",
      institution: "VTU",
      location: "India",
      startYear: "2015",
      endYear: "2019",
    },
  ],
  projects: [
    {
      id: "proj-open-source-etl-monitor",
      projectTitle: "Open Source ETL Monitor",
      synopsis: "CLI tool for tracking dbt run status with Slack alerting",
      date: "November 2021",
    },
    {
      id: "proj-churn-prediction",
      projectTitle: "Churn Prediction Model",
      synopsis: "XGBoost classifier achieving 87% AUC on e-commerce customer data",
      date: "March 2022",
    },
  ],
  languages: [
    {
      id: "lang-english",
      language: "English",
      proficiencyLabel: "Professional Proficiency",
      cefrLevel: "C2",
    },
    {
      id: "lang-german",
      language: "German",
      proficiencyLabel: "Intermediate Proficiency",
      cefrLevel: "B1",
    },
  ],
  certifications: [
    {
      id: "cert-ibm-data-engineering",
      certName: "Data Engineering Foundations Specialization",
      issuer: "IBM",
      date: "April 2024",
    },
    {
      id: "cert-snowflake-data-engineering",
      certName: "Snowflake Data Engineering",
      issuer: "Snowflake",
      date: "April 2024",
    },
  ],
};
