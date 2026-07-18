"use client"

import * as React from "react"
import { PageContainer, SectionContainer, ContentWrapper } from "@/components/layout/layout-primitives"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Bell, Eye, Shield, Info, Moon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

function SettingToggle({ label, defaultChecked = false, description }: { label: string, defaultChecked?: boolean, description?: string }) {
  const [checked, setChecked] = React.useState(defaultChecked)
  return (
    <div className="flex items-center justify-between py-3 min-h-[4rem]">
      <div className="flex flex-col justify-center space-y-0.5 pr-4 flex-1">
        <label className="text-body-md font-medium text-night-900 cursor-pointer" onClick={() => setChecked(!checked)}>
          {label}
        </label>
        {description && <p className="text-body-sm text-neutral-600">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-[24px] w-[44px] shrink-0 items-center cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? 'bg-pitch-500' : 'bg-neutral-300'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none block h-[20px] w-[20px] rounded-full bg-neutral-0 shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function SettingSelect({ label, options, defaultValue }: { label: string, options: string[], defaultValue: string }) {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <div className="flex items-center justify-between py-3">
      <label className="text-body-md font-medium text-night-900">{label}</label>
      <select 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        aria-label={label}
        className="block w-40 rounded-md border-neutral-300 bg-neutral-50 py-1.5 pl-3 pr-8 text-body-sm text-night-900 focus:ring-2 focus:ring-focus-ring focus:outline-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <PageContainer>
      <SectionContainer className="py-6 md:py-10">
        <ContentWrapper size="sm" className="space-y-6">
          <div className="mb-8">
            <h1 className="text-display-lg text-night-900 font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-body-md text-neutral-600">Manage your preferences for the InfantinoOrg experience.</p>
          </div>

          <Card variant="standard">
            <CardHeader className="pb-3 border-b border-neutral-100 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-h4">
                <Globe className="h-5 w-5 text-neutral-600" />
                Language & Region
              </CardTitle>
              <Badge variant="neutral">Coming Soon</Badge>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-neutral-100 pointer-events-none bg-neutral-50/30">
              <SettingSelect label="Language" options={["English", "Spanish", "French", "Arabic"]} defaultValue="English" />
              <SettingSelect label="Time Zone" options={["Host City Time", "My Device Time"]} defaultValue="Host City Time" />
            </CardContent>
          </Card>

          <Card variant="standard">
            <CardHeader className="pb-3 border-b border-neutral-100 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-h4">
                <Moon className="h-5 w-5 text-neutral-600" />
                Appearance
              </CardTitle>
              <Badge variant="neutral">Coming Soon</Badge>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-neutral-100 pointer-events-none bg-neutral-50/30">
              <SettingSelect label="Theme" options={["System Default", "Light", "Dark"]} defaultValue="System Default" />
              <p className="text-caption text-neutral-600 pt-2">(Note: Theme preference is saved locally. Dark mode support is coming soon.)</p>
            </CardContent>
          </Card>

          <Card variant="standard">
            <CardHeader className="pb-3 border-b border-neutral-100 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-h4">
                <Eye className="h-5 w-5 text-neutral-600" />
                Accessibility
              </CardTitle>
              <Badge variant="neutral">Coming Soon</Badge>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-neutral-100 pointer-events-none bg-neutral-50/30">
              <SettingToggle label="High Contrast Map" description="Enhance map readability" defaultChecked={false} />
              <SettingToggle label="Reduce Motion" description="Minimize animations across the app" defaultChecked={false} />
              <SettingToggle label="Screen Reader Priority" description="Optimize layout for voiceover" defaultChecked={false} />
            </CardContent>
          </Card>

          <Card variant="standard">
            <CardHeader className="pb-3 border-b border-neutral-100 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-h4">
                <Bell className="h-5 w-5 text-neutral-600" />
                Notifications
              </CardTitle>
              <Badge variant="neutral">Coming Soon</Badge>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-neutral-100 pointer-events-none bg-neutral-50/30">
              <SettingToggle label="Route Updates" description="Live delays and alternative routes" defaultChecked={true} />
              <SettingToggle label="Crowd Alerts" description="Warnings for heavily congested areas" defaultChecked={true} />
              <SettingToggle label="Volunteer Shift Reminders" description="For active volunteers only" defaultChecked={false} />
            </CardContent>
          </Card>

          <Card variant="standard">
            <CardHeader className="pb-3 border-b border-neutral-100">
              <CardTitle className="flex items-center gap-2 text-h4">
                <Info className="h-5 w-5 text-neutral-600" />
                About & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-neutral-100">
              <div className="py-3 flex justify-between items-center cursor-pointer hover:bg-neutral-50 px-2 -mx-2 rounded-md">
                <div className="flex items-center gap-2 text-night-900 font-medium text-body-md">
                  <Shield className="h-4 w-4 text-neutral-400" /> Privacy Policy
                </div>
              </div>
              <div className="py-3 flex justify-between items-center cursor-pointer hover:bg-neutral-50 px-2 -mx-2 rounded-md">
                <span className="text-night-900 font-medium text-body-md">Terms of Service</span>
              </div>
              <div className="py-3 flex justify-between items-center px-2 -mx-2 text-neutral-600 text-body-sm">
                <span>App Version</span>
                <span>1.0.0-rc</span>
              </div>
            </CardContent>
          </Card>

        </ContentWrapper>
      </SectionContainer>
    </PageContainer>
  )
}
