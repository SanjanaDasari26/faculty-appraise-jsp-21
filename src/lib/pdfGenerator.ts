import jsPDF from 'jspdf';

interface FacultyData {
  id: string;
  name: string;
  department: string;
  designation?: string;
  email: string;
}

interface FacultyStats {
  publications: number;
  seminars: number;
  events: number;
  lectures: number;
  projects: number;
}

export const generateFacultyReport = (faculty: FacultyData, stats: FacultyStats) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Faculty Self-Appraisal Report', pageWidth / 2, 30, { align: 'center' });
  
  // Faculty Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Faculty Information', 20, 50);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${faculty.name}`, 20, 65);
  doc.text(`Department: ${faculty.department}`, 20, 75);
  doc.text(`Designation: ${faculty.designation || 'Faculty'}`, 20, 85);
  doc.text(`Email: ${faculty.email}`, 20, 95);
  
  // Activity Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Activity Summary', 20, 120);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const summaryY = 135;
  doc.text(`Publications: ${stats.publications}`, 20, summaryY);
  doc.text(`Seminars Attended: ${stats.seminars}`, 20, summaryY + 15);
  doc.text(`Events Organized: ${stats.events}`, 20, summaryY + 30);
  doc.text(`Guest Lectures: ${stats.lectures}`, 20, summaryY + 45);
  doc.text(`Projects: ${stats.projects}`, 20, summaryY + 60);
  
  // Get detailed data from localStorage
  const publications = JSON.parse(localStorage.getItem(`publications_${faculty.id}`) || '[]');
  const seminars = JSON.parse(localStorage.getItem(`seminars_${faculty.id}`) || '[]');
  const events = JSON.parse(localStorage.getItem(`events_${faculty.id}`) || '[]');
  const lectures = JSON.parse(localStorage.getItem(`lectures_${faculty.id}`) || '[]');
  const projects = JSON.parse(localStorage.getItem(`projects_${faculty.id}`) || '[]');
  
  let currentY = 220;
  
  // Publications Detail
  if (publications.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Publications', 20, currentY);
    currentY += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    publications.forEach((pub: any, index: number) => {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 30;
      }
      doc.text(`${index + 1}. ${pub.title}`, 20, currentY);
      currentY += 10;
      doc.text(`   Journal: ${pub.journal}`, 20, currentY);
      currentY += 10;
      doc.text(`   Year: ${pub.year}`, 20, currentY);
      currentY += 15;
    });
  }
  
  // Add other sections similarly...
  if (seminars.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 30;
    }
    currentY += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Seminars', 20, currentY);
    currentY += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    seminars.forEach((sem: any, index: number) => {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 30;
      }
      doc.text(`${index + 1}. ${sem.title}`, 20, currentY);
      currentY += 10;
      doc.text(`   Organizer: ${sem.organizer}`, 20, currentY);
      currentY += 10;
      doc.text(`   Date: ${sem.date}`, 20, currentY);
      currentY += 15;
    });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 20);
  doc.text(`Faculty Report`, pageWidth - 40, pageHeight - 20);
  
  return doc;
};

export const generateAllFacultyReports = () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const faculty = users.filter((user: any) => user.userType === "faculty");
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Cover page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('All Faculty Reports', pageWidth / 2, 50, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 80, { align: 'center' });
  doc.text(`Total Faculty: ${faculty.length}`, pageWidth / 2, 100, { align: 'center' });
  
  let currentY = 140;
  
  faculty.forEach((member: any, index: number) => {
    const publications = JSON.parse(localStorage.getItem(`publications_${member.id}`) || "[]");
    const seminars = JSON.parse(localStorage.getItem(`seminars_${member.id}`) || "[]");
    const events = JSON.parse(localStorage.getItem(`events_${member.id}`) || "[]");
    const lectures = JSON.parse(localStorage.getItem(`lectures_${member.id}`) || "[]");
    const projects = JSON.parse(localStorage.getItem(`projects_${member.id}`) || "[]");
    
    if (currentY > 250) {
      doc.addPage();
      currentY = 30;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${member.name}`, 20, currentY);
    currentY += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Department: ${member.department}`, 30, currentY);
    currentY += 10;
    doc.text(`Publications: ${publications.length}, Seminars: ${seminars.length}, Events: ${events.length}`, 30, currentY);
    currentY += 10;
    doc.text(`Lectures: ${lectures.length}, Projects: ${projects.length}`, 30, currentY);
    currentY += 20;
  });
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};