"use client";

import Link from "next/link";
import styles from "./page.module.css";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { RiRobot2Fill } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi";
import { TbFlagSpark } from "react-icons/tb";
import { SlSpeech } from "react-icons/sl";
import { FaHourglass } from "react-icons/fa6";
import { TbSpy } from "react-icons/tb";
import { GoPeople } from "react-icons/go";


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
            <p>O Salazar automatiza narrações, gerencia países, simula diplomacia e cria um mundo vivo para seus roleplays geopolíticos no Discord.</p>
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
              <div className={styles.icon}><HiOutlineSparkles /></div>
              <h1 className={styles.title}>Narrações com IA</h1>
              <p className={styles.description}>O Salazar narra automaticamente as ações dos jogadores usando inteligência artificial avançada, criando uma experiência imersiva e dinâmica.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}><TbFlagSpark /></div>
              <h1 className={styles.title}>Gerenciamento de Países</h1>
              <p className={styles.description}>Sistema completo de escolha e gestão de países, com criação automática de canais privados, cargos personalizados e emojis únicos.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}><SlSpeech /></div>
              <h1 className={styles.title}>Diplomacia Inteligente</h1>
              <p className={styles.description}>Simula interações diplomáticas com países NPCs, processa declarações de guerra e cria automaticamente canais de conflito.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}><FaHourglass /></div>
              <h1 className={styles.title}>Passagem de Tempo</h1>
              <p className={styles.description}>Sistema automático e configurável de passagem de anos no roleplay, com anúncios personalizados e atualização de nomes de servidor.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}><TbSpy /></div>
              <h1 className={styles.title}>Ações Secretas</h1>
              <p className={styles.description}>Sistema seguro para ações secretas que apaga mensagens imediatamente e as envia para um canal administrativo privado.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}><GoPeople /></div>
              <h1 className={styles.title}>NPCs Autônomos</h1>
              <p className={styles.description}>Países NPCs podem realizar ações aleatórias condizentes com o roleplay, criando um mundo vivo e dinâmico.</p>
            </div>
          </div>
        </section>
        <section className={[styles.section, styles.section3].join(' ')}>
          <div className={styles.title}>
            <h1>Como Funciona?</h1>
            <p>Configure em minutos e comece seu roleplay!</p>
          </div>
          <div className={styles.steps}>
            <section className={styles.step}>
              <div className={styles.number}>1</div>
              <div className={styles.card}>
                <h3>Adicione o Salazar</h3>
                <p>Adicione o bot ao seu servidor Discord com um clique e dê as permissões necessárias.</p>
              </div>
            </section>
            <section className={styles.step}>
              <div className={styles.number}>2</div>
              <div className={styles.card}>
                <h3>Pagamento</h3>
                <p>Entre em contato com o desenvolvedor para assinar seu plano!</p>
              </div>
            </section>
            <section className={styles.step}>
              <div className={styles.number}>3</div>
              <div className={styles.card}>
                <h3>Configure no Dashboard</h3>
                <p>Acesse o dashboard web e configure canais, cargos, tempos e preferências do seu roleplay.</p>
              </div>
            </section>
            <section className={styles.step}>
              <div className={styles.number}>4</div>
              <div className={styles.card}>
                <h3>Defina o Canal de Memória</h3>
                <p>Crie um fórum para a memória do bot onde todos os acontecimentos serão registrados cronologicamente.</p>
              </div>
            </section>
            <section className={styles.step}>
              <div className={styles.number}>5</div>
              <div className={styles.card}>
                <h3>Comece a Jogar</h3>
                <p>Jogadores enviam ações, o Salazar narra automaticamente, registra eventos e mantém a história viva!</p>
              </div>
            </section>
          </div>
        </section>
        <section className={[styles.section, styles.section4].join(' ')}>
          <h1>Pronto para Começar?</h1>
          <p>Transforme seu servidor Discord em um roleplay geopolítico épico com narrações automáticas por IA.</p>
          <Link href="https://discord.com/oauth2/authorize?client_id=767858186676994070" target="_blank" className={styles.primary}><RiRobot2Fill /> Adicionar o Salazar agora!</Link>
        </section>
      </main>
    </div>
  );
}
