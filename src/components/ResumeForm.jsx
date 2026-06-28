import PersonalDetailsSection from './PersonalDetailsSection'
import EducationSection from './EducationSection'
import SkillsSection from './SkillsSection'
import ExperienceSection from './ExperienceSection'
import ProjectsSection from './ProjectsSection'
import CertificationsSection from './CertificationsSection'
import AchievementsSection from './AchievementsSection'
import AdditionalSections from './AdditionalSections'
import ThemeTemplatePicker from './ThemeTemplatePicker'

export default function ResumeForm({ resume, setField, errors }) {
  return (
    <div className="resume-form">
      <ThemeTemplatePicker
        theme={resume.theme}
        template={resume.template}
        onThemeChange={(v) => setField('theme', v)}
        onTemplateChange={(v) => setField('template', v)}
      />

      <PersonalDetailsSection
        personal={resume.personal}
        onChange={(v) => setField('personal', v)}
        errors={errors}
        resume={resume}
      />

      <EducationSection education={resume.education} onChange={(v) => setField('education', v)} />

      <SkillsSection
        skillCategories={resume.skillCategories}
        onChange={(v) => setField('skillCategories', v)}
      />

      <ProjectsSection projects={resume.projects} onChange={(v) => setField('projects', v)} />

      <ExperienceSection experience={resume.experience} onChange={(v) => setField('experience', v)} />

      <CertificationsSection
        certifications={resume.certifications}
        onChange={(v) => setField('certifications', v)}
      />

      <AchievementsSection
        achievements={resume.achievements}
        onChange={(v) => setField('achievements', v)}
      />

      <AdditionalSections
        customSections={resume.customSections}
        onChange={(v) => setField('customSections', v)}
      />
    </div>
  )
}
