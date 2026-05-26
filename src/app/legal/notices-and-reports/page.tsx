import { Container } from "@/components/ui/container";
import { FileText, Download, BookOpen, Users, Gavel } from "lucide-react";

const annualReports = [
    {
        title: "MGT-7 Annual Return 2024-25",
        fileName: "MGT-7_2024-25.pdf",
        year: "2024-25",
    },
    {
        title: "MGT-7 Annual Return 2023-24",
        fileName: "MGT_7_2023-24.pdf",
        year: "2023-24",
    },
    {
        title: "MGT-7 Annual Return 2022-23",
        fileName: "MGT_7_2022-23.pdf",
        year: "2022-23",
    },
    {
        title: "MGT-7 Annual Return 2021-22",
        fileName: "MGT_7_2021-22.pdf",
        year: "2021-22",
    },
];

const agmReports = [
    {
        title: "Notice of 39th Annual General Meeting 2025",
        fileName: "AGM 2025.pdf",

    },
    {
        title: "Notice of 38th Annual General Meeting 2024",
        fileName: "AGM 2024.pdf",

    },
    {
        title: "Notice of 37th Annual General Meeting 2023",
        fileName: "AGM 2023.pdf",

    },
    {
        title: "Notice of 36th Annual General Meeting 2022",
        fileName: "AGM 2022.pdf",

    },
];

const eogmReports = [
    {
        title: "Extra-Ordinary General Meeting — 24.03.2025",
        fileName: "EOGM - 24.03.2025.pdf",
        description: "EOGM held on March 24, 2025",
    },
    {
        title: "Extra-Ordinary General Meeting — 18.07.2022",
        fileName: "EOGM - 18.07.2022.pdf",
        description: "EOGM held on July 18, 2022",
    },
];

export default function AnnualReportsPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-black text-white py-16">
                <Container>
                    <div className="flex items-center gap-4 mb-4">
                        <BookOpen className="h-12 w-12" />
                        <h1 className="text-4xl md:text-5xl font-bold">Notices & Reports</h1>
                    </div>
                    <p className="text-xl text-white">
                        MGT-7 Annual Returns, AGM & EOGM Reports filed with the Ministry of Corporate Affairs
                    </p>
                </Container>
            </section>

            <section className="py-16">
                <Container>
                    <div className="max-w-4xl mx-auto space-y-16">

                        {/* MGT-7 Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">MGT-7 Annual Returns</h2>
                            </div>
                            <p className="text-gray-600 mb-6 ml-13">
                                Form MGT-7 is an annual return that every company registered in India is required to file with the Registrar of Companies (ROC). Below are the annual returns filed by Sunidhi Securities & Finance Limited.
                            </p>

                            <div className="space-y-3">
                                {annualReports.map((report) => (
                                    <div
                                        key={report.year}
                                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                                <p className="text-sm text-gray-500">Financial Year {report.year}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`/legal-documents/notices-and-reports/${report.fileName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors flex-shrink-0"
                                        >
                                            <Download className="h-4 w-4" />
                                            View PDF
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AGM Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Annual General Meetings (AGM)</h2>
                            </div>
                            <p className="text-gray-600 mb-6 ml-13">
                                Annual General Meetings of Sunidhi Securities & Finance Limited.
                            </p>

                            <div className="space-y-3">
                                {agmReports.map((report) => (
                                    <div
                                        key={report.fileName}
                                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                            </div>
                                        </div>
                                        <a
                                            href={`/legal-documents/notices-and-reports/${report.fileName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
                                        >
                                            <Download className="h-4 w-4" />
                                            View PDF
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* EOGM Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Gavel className="h-5 w-5 text-amber-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Extra-Ordinary General Meetings (EOGM)</h2>
                            </div>
                            <p className="text-gray-600 mb-6 ml-13">
                                Extra-Ordinary General Meetings convened for special business matters.
                            </p>

                            <div className="space-y-3">
                                {eogmReports.map((report) => (
                                    <div
                                        key={report.fileName}
                                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                                <p className="text-sm text-gray-500">{report.description}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`/legal-documents/notices-and-reports/${report.fileName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors flex-shrink-0"
                                        >
                                            <Download className="h-4 w-4" />
                                            View PDF
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}
