import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#000" },
  name: { fontSize: 18, textAlign: "center", marginBottom: 3 },
  contact: { fontSize: 9, textAlign: "center", marginBottom: 10 },
  sectionHeading: {
    fontSize: 12,
    color: "#1155CC",
    borderBottomWidth: 1,
    borderBottomColor: "#1155CC",
    paddingBottom: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
  italic: { fontFamily: "Helvetica-Oblique" },
  small: { fontSize: 9 },
  bullet: { marginLeft: 8, marginBottom: 1 },
});

const getListItems = (html: string): string[] => {
  if (!html) return [];
  return html
    .replace(/<li>/gi, "\n• ")
    .replace(/<\/li>/gi, "")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
};

const stripHtml = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

interface Props {
  data: ResumeData;
}

export function ResumePdfDocument({ data }: Props): JSX.Element {
  const { personalInfo, profile, skills, experience, education, projects, languages, certifications } = data;
  const cityCountry = [personalInfo.city, personalInfo.country].filter(Boolean).join(", ");
  const contact = [
    personalInfo.linkedinUrl,
    personalInfo.portfolioUrl,
    personalInfo.phone,
    cityCountry,
    personalInfo.email,
  ]
    .filter(Boolean)
    .join("  •  ");

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{personalInfo.fullName || "Your Name"}</Text>
        {contact ? <Text style={styles.contact}>{contact}</Text> : null}

        {profile.summaryText ? (
          <View>
            <Text style={styles.sectionHeading}>Profile</Text>
            <Text>{stripHtml(profile.summaryText)}</Text>
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View>
            <Text style={styles.sectionHeading}>Skills & Technologies</Text>
            {skills.map((s) => (
              <Text key={s.id}>
                <Text style={styles.bold}>{s.categoryName}: </Text>
                {s.skills}
              </Text>
            ))}
          </View>
        ) : null}

        {experience.length > 0 ? (
          <View>
            <Text style={styles.sectionHeading}>Work Experience</Text>
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
                <Text style={[styles.italic, styles.small]}>{e.location}</Text>
                {getListItems(e.bulletPoints.join("")).map((bp, i) => (
                  <Text key={i} style={styles.bullet}>
                    {bp}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {education.length > 0 ? (
          <View>
            <Text style={styles.sectionHeading}>Education</Text>
            {education.map((e) => (
              <View key={e.id} style={styles.row}>
                <Text>
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
        ) : null}

        {projects.length > 0 ? (
          <View>
            <Text style={styles.sectionHeading}>Projects & Extra</Text>
            {projects.map((p) => (
              <View key={p.id} style={styles.row}>
                <Text>
                  <Text style={styles.bold}>{p.projectTitle}: </Text>
                  {p.synopsis}
                </Text>
                <Text style={styles.bold}>{p.date}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {languages.length > 0 ? (
          <View>
            <Text style={styles.sectionHeading}>Languages</Text>
            {languages.map((l) => (
              <Text key={l.id}>
                {l.language}: {l.proficiencyLabel} ({l.cefrLevel})
              </Text>
            ))}
          </View>
        ) : null}

        {certifications.length > 0 ? (
          <View>
            <Text style={styles.sectionHeading}>Certifications</Text>
            {certifications.map((c) => (
              <View key={c.id} style={styles.row}>
                <Text>
                  {c.certName} ({c.issuer})
                </Text>
                <Text style={styles.bold}>{c.date}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
