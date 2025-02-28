import type { Metadata } from "next"
import MockupGenerator from "@/components/mockup-generator"

export const metadata: Metadata = {
  title: "Website Mockup Generator",
  description: "Create beautiful website mockups across multiple devices",
}

export default function Home() {
  return (
    <main className=" mx-auto py-10 px-4 md:px-6">
      <div className=" mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Website Mockup Generator</h1>
          <p className="text-xl text-muted-foreground">
            Create beautiful mockups of your website across multiple devices
          </p>
        </div>
        <MockupGenerator />
      </div>
    </main>
  )
}

