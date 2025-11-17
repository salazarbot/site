"use client";

import { SessionProvider } from "next-auth/react";
import { ProgressProvider } from '@bprogress/next/app';
import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css';
import '@/styles/ntPopups.css';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ProgressProvider
        height="2px"
        color="#ffffffff"
        options={{ showSpinner: false }}
        shallowRouting
      >
        <NtPopupProvider language="ptbr" theme="dark">
          {children}
        </NtPopupProvider>
      </ProgressProvider>
    </SessionProvider>
  );
}
