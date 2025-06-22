import { resumeData } from "@/lib/resume.data";

export default function Home() {
  return <pre>{JSON.stringify(resumeData, null, 2)}</pre>;
}
