import * as React from "react";
import { Tailwind, Section, Text } from "@react-email/components";

export default function AuthEmail({
  message,
  link,
}: {
  message: string;
  link: string;
}) {
  return (
    <Tailwind>
      <Section className="flex justify-center items-center w-full min-h-screen font-sans">
        <Section className="flex flex-col items-center w-76 rounded-2xl px-6 py-1 bg-gray-50">
          <Text className="text-2xl font-medium text-violet-500">
            {message}
          </Text>
          <Text className="text-gray-500 my-0">
            Use the following Link to {message}
          </Text>
          <a href={link} className="text-blue-400 font-bold pt-2">
            Link
          </a>
          <Text className="text-gray-600 text-xs">Thanks</Text>
        </Section>
      </Section>
    </Tailwind>
  );
}

AuthEmail.PreviewProps = {
  link: "https://example.com",
  message: "Verify your email address",
};
