"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResumeStore } from "@/store/resumeStore";
import { AccordionItem } from "./AccordionItem";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { WorkExperienceForm } from "./WorkExperienceForm";
import { EducationForm } from "./EducationForm";
import { ProjectForm } from "./ProjectForm";
import { SkillsForm } from "./SkillsForm";
import { RichTextEditor } from "./RichTextEditor";
import { ChevronDown, ChevronUp } from "lucide-react";

const SECTION_TITLES: Record<string, string> = {
  profile: "Profile Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  languages: "Languages",
  certifications: "Certifications",
};

export function AccordionPanel() {
  const sectionOrder = useResumeStore((state) => state.sectionOrder);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const profileText = useResumeStore((state) => state.resumeData.profile.summaryText);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["personalInfo", "profile"]));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // allows clicking inside inputs
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as any);
      const newIndex = sectionOrder.indexOf(over.id as any);
      reorderSections(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case "profile":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Summary / Profile</label>
            <div className="bg-white rounded-md">
              <RichTextEditor
                value={profileText}
                onChange={(html) =>
                  useResumeStore.setState((state) => {
                    state.resumeData.profile.summaryText = html;
                  })
                }
              />
            </div>
          </div>
        );
      case "experience":
        return <WorkExperienceForm />;
      case "education":
        return <EducationForm />;
      case "skills":
        return <SkillsForm />;
      case "projects":
        return <ProjectForm />;
      case "languages":
        return <div className="text-sm text-gray-500 py-4 text-center">Languages form coming soon</div>;
      case "certifications":
        return <div className="text-sm text-gray-500 py-4 text-center">Certifications form coming soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-white p-6 flex flex-col">
      {/* Static Personal Info Section */}
      <div className="mb-4 border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
          onClick={() => toggleSection("personalInfo")}
        >
          <span className="font-medium text-gray-800">Personal Information</span>
          <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
            {openSections.has("personalInfo") ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {openSections.has("personalInfo") && (
          <div className="p-4 bg-white">
            <PersonalInfoForm />
          </div>
        )}
      </div>

      {/* Draggable Sections */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          {sectionOrder.map((id) => (
            <AccordionItem
              key={id}
              id={id}
              title={SECTION_TITLES[id] || id}
              isOpen={openSections.has(id)}
              onToggle={() => toggleSection(id)}
            >
              {renderSectionContent(id)}
            </AccordionItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
