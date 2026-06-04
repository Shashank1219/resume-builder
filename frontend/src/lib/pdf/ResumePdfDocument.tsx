import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData, SectionKey } from "@/types/resume";
import {
  TEMPLATE1_SECTION_ORDER,
  TEMPLATE1_SECTION_TITLES,
} from "@/templates/template-1/template1Spec";
import { htmlToPlainText } from "@/templates/template-1/htmlToDocxRuns";

const BLUE = "#1155CC";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#000",
    lineHeight: 1.35,
  },
  name: { fontSize: 20, textAlign: "center", marginBottom: 2 },
  contactLine: { fontSize: 11, textAlign: "center", marginBottom: 1 },
  contactLink: { color: BLUE },
  sectionHeading: {
    fontSize: 13,
    color: BLUE,
    borderBottomWidth: 1,
    borderBottomColor: BLUE,
    paddingBottom: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
  italic: { fontFamily: "Helvetica-Oblique" },
  bullet: { marginLeft: 12, marginBottom: 2 },
  skillLine: { marginBottom: 1 },
  langLabel: { width: 72 },
});

interface Props {
  data: ResumeData;
  sectionOrder?: SectionKey[];
}

export function ResumePdfDocument({ data, sectionOrder }: Props): React.ReactElement {
  const { personalInfo, profile, skills, experience, education, projects, languages, certifications } =
    data;
  const order = sectionOrder?.length ? sectionOrder : TEMPLATE1_SECTION_ORDER;
  const cityCountry = [personalInfo.city, personalInfo.country].filter(Boolean).join(", ");

  const line2 = [personalInfo.linkedinUrl, personalInfo.portfolioUrl].filter((s) => s?.trim());
  const line3 = [personalInfo.phone, cityCountry, personalInfo.email].filter((s) => s?.trim());

  const sectionBlocks: Record<SectionKey, React.ReactElement | null> = {
    profile: profile.summaryText.trim() ? (
      <View key="profile">
        <Text style={styles.sectionHeading}>{TEMPLATE1_SECTION_TITLES.profile}</Text>
        <Text>{htmlToPlainText(profile.summaryText)}</Text>
      </View>
    ) : null,
    skills:
      skills.length > 0 ? (
        <View key="skills">
          <Text style={styles.sectionHeading}>{TEMPLATE1_SECTION_TITLES.skills}</Text>
          {skills.map((s) => (
            <Text key={s.id} style={styles.skillLine}>
              <Text style={styles.bold}>{s.categoryName}: </Text>
              {s.skills}
            </Text>
          ))}
        </View>
      ) : null,
    experience:
      experience.length > 0 ? (
        <View key="experience">
          <Text style={styles.sectionHeading}>{TEMPLATE1_SECTION_TITLES.experience}</Text>
          {experience.map((e) => (
            <View key={e.id} style={{ marginBottom: 6 }}>
              <View style={styles.row}>
                <Text style={styles.bold}>
                  {e.jobTitle}  {e.companyName}
                </Text>
                <Text style={styles.bold}>
                  {e.startDate} - {e.isCurrent ? "Present" : e.endDate}
                </Text>
              </View>
              {e.location ? <Text>{e.location}</Text> : null}
              {e.bulletPoints.map((bp, i) => {
                const text = htmlToPlainText(bp);
                return text ? (
                  <Text key={i} style={styles.bullet}>
                    • {text}
                  </Text>
                ) : null;
              })}
            </View>
          ))}
        </View>
      ) : null,
    education:
      education.length > 0 ? (
        <View key="education">
          <Text style={styles.sectionHeading}>{TEMPLATE1_SECTION_TITLES.education}</Text>
          {education.map((e) => (
            <View key={e.id} style={styles.row}>
              <Text style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.bold}>
                  {e.degreeType}: {e.fieldOfStudy}
                </Text>
                {`, ${e.institution}, ${e.location}`}
              </Text>
              <Text>
                {e.startYear} - {e.endYear}
              </Text>
            </View>
          ))}
        </View>
      ) : null,
    projects:
      projects.length > 0 ? (
        <View key="projects">
          <Text style={styles.sectionHeading}>{TEMPLATE1_SECTION_TITLES.projects}</Text>
          {projects.map((p) => (
            <View key={p.id} style={{ marginBottom: 4 }}>
              <View style={styles.row}>
                <Text style={styles.bold}>{p.projectTitle}:</Text>
                <Text style={styles.bold}>{p.date}</Text>
              </View>
              {htmlToPlainText(p.synopsis) ? (
                <Text style={styles.bullet}>• {htmlToPlainText(p.synopsis)}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null,
    languages:
      languages.length > 0 ? (
        <View key="languages">
          <Text style={styles.sectionHeading}>{TEMPLATE1_SECTION_TITLES.languages}</Text>
          {languages.map((l) => (
            <View key={l.id} style={{ flexDirection: "row" }}>
              <Text style={styles.langLabel}>{l.language}:</Text>
              <Text>
                {l.proficiencyLabel} ({l.cefrLevel})
              </Text>
            </View>
          ))}
        </View>
      ) : null,
    certifications:
      certifications.length > 0 ? (
        <View key="certifications">
          <Text style={styles.sectionHeading}>{TEMPLATE1_SECTION_TITLES.certifications}</Text>
          {certifications.map((c) => (
            <View key={c.id} style={styles.row}>
              <Text style={{ flex: 1, paddingRight: 8 }}>
                {c.certName} ({c.issuer})
              </Text>
              <Text style={styles.bold}>{c.date}</Text>
            </View>
          ))}
        </View>
      ) : null,
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{personalInfo.fullName.trim() || "Your Name"}</Text>

        {line2.length > 0 ? (
          <Text style={styles.contactLine}>
            {line2.map((part, i) => (
              <Text key={i}>
                {i > 0 ? " • " : ""}
                <Text style={styles.contactLink}>{part.trim()}</Text>
              </Text>
            ))}
          </Text>
        ) : null}

        {line3.length > 0 ? (
          <Text style={[styles.contactLine, { marginBottom: 8 }]}>
            {line3.map((part, i) => (
              <Text key={i}>
                {i > 0 ? " • " : ""}
                <Text style={part === personalInfo.email.trim() ? styles.italic : undefined}>
                  {part.trim()}
                </Text>
              </Text>
            ))}
          </Text>
        ) : null}

        {order.map((key) => sectionBlocks[key])}
      </Page>
    </Document>
  );
}
