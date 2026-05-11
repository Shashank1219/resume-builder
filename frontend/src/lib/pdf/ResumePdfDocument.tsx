import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#666',
  },
  sectionHeading: {
    fontSize: 12,
    color: '#1155CC',
    borderBottomWidth: 1,
    borderBottomColor: '#1155CC',
    paddingBottom: 2,
    marginBottom: 8,
    marginTop: 15,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  italic: {
    fontFamily: 'Helvetica-Oblique',
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  skillsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  }
});

const stripHtml = (html: string) => {
  if (!html) return '';
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  return html.replace(/<[^>]+>/g, '');
};

const getListItems = (html: string) => {
  if (!html) return [];
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const items = Array.from(doc.body.querySelectorAll('li')).map(li => li.textContent || '');
    if (items.length > 0) return items;
    return [doc.body.textContent || ''];
  }
  return [html.replace(/<[^>]+>/g, '')];
};

export function ResumePdfDocument({ data }: { data: ResumeData }) {
  const { personalInfo, profile, experience, education, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <Text style={styles.contact}>
            {[
              personalInfo.linkedinUrl, 
              personalInfo.phone, 
              [personalInfo.city, personalInfo.country].filter(Boolean).join(', '),
              personalInfo.email
            ].filter(Boolean).join(' | ')}
          </Text>
        </View>

        {profile.summaryText && (
          <View>
            <Text style={styles.sectionHeading}>Profile</Text>
            <Text>{stripHtml(profile.summaryText)}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Experience</Text>
            {experience.map(exp => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{exp.jobTitle}</Text>
                  <Text>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.italic}>{exp.companyName}</Text>
                  <Text>{exp.location}</Text>
                </View>
                {getListItems(exp.bulletPoints.join('')).map((bullet, i) => bullet && (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Education</Text>
            {education.map(edu => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{edu.institution}</Text>
                  <Text>{edu.startYear} - {edu.endYear}</Text>
                </View>
                <View style={styles.row}>
                  <Text>{edu.degreeType} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</Text>
                  <Text>{edu.location}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Projects</Text>
            {projects.map(proj => (
              <View key={proj.id} style={{ marginBottom: 8 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{proj.projectTitle}</Text>
                  <Text>{proj.date}</Text>
                </View>
                <Text>{stripHtml(proj.synopsis)}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Skills</Text>
            {skills.map(skill => (
              <View key={skill.id} style={styles.skillsRow}>
                <Text style={styles.bold}>{skill.categoryName}: </Text>
                <Text>{skill.skills}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
