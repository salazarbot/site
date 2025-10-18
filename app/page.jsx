"use client";

import Link from "next/link";
import styles from "./page.module.css";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { RiRobot2Fill } from "react-icons/ri";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <section className={[styles.section, styles.section1].join(' ')}>
          <div className={styles.title}>
            <h2>Seu Roleplay Geopolítico</h2>
            <h1>COM INTELIGÊNCIA ARTIFICIAL</h1>
          </div>
          <div className={styles.description}>
            <p>O Salazar automatiza narrações, gerencia países, simula</p>
            <p>diplomacia e cria um mundo vivo para seus roleplays</p>
            <p>geopolíticos no Discord.</p>
          </div>
          <div className={styles.buttons}>
            <Link href="https://discord.com/oauth2/authorize?client_id=767858186676994070" target="_blank" className={styles.primary}><RiRobot2Fill /> Adicionar!</Link>
            {session && <Link href={'/dashboard'}>Dashboard</Link>}
          </div>
        </section>
        <section className={[styles.section, styles.section2].join(' ')}>
          <div className={styles.title}>
            <h1>Features</h1>
            <p>Tudo que você precisa para gerenciar um roleplay geopolítico completo</p>
          </div>
          <div className={styles.features}>
            <div className={styles.card}>
              <div className={styles.icon}></div>
              <h1 className={styles.title}>Narrações com IA</h1>
              <p className={styles.description}>O Salazar narra automaticamente as ações dos jogadores usando inteligência artificial avançada, criando uma experiência imersiva e dinâmica.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}></div>
              <h1 className={styles.title}>Gerenciamento de Países</h1>
              <p className={styles.description}>Sistema completo de escolha e gestão de países, com criação automática de canais privados, cargos personalizados e emojis únicos.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}></div>
              <h1 className={styles.title}>Diplomacia Inteligente</h1>
              <p className={styles.description}>Simula interações diplomáticas com países NPCs, processa declarações de guerra e cria automaticamente canais de conflito.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}></div>
              <h1 className={styles.title}>Passagem de Tempo</h1>
              <p className={styles.description}>Sistema automático e configurável de passagem de anos no roleplay, com anúncios personalizados e atualização de nomes de servidor.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}></div>
              <h1 className={styles.title}>Ações Secretas</h1>
              <p className={styles.description}>Sistema seguro para ações secretas que apaga mensagens imediatamente e as envia para um canal administrativo privado.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}></div>
              <h1 className={styles.title}>NPCs Autônomos</h1>
              <p className={styles.description}>Países NPCs podem realizar ações aleatórias condizentes com o roleplay, criando um mundo vivo e dinâmico.</p>
            </div>
          </div>
        </section>
        <section className={[styles.section, styles.section3].join(' ')}>
          C
        </section>
        <section className={[styles.section, styles.section4].join(' ')}>
          D
        </section>
      </main>
    </div>
  );
}
