import Header from "@/components/Header";
import styles from "./page.module.css";
import Settings from "@/components/Settings";

export async function generateMetadata({ params }) {
  const { guildId } = await params;
  
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/discord/guild?id=${guildId}`);
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    const guild = await res.json();
    
    console.log('Guild response:', guild);
    
    const guildName = guild?.name || guild?.server?.name || 'Servidor';

    return {
      title: `Dashboard de ${guildName}`,
      description: `Configurações e informações do servidor ${guildName} no Salazar.`,
      openGraph: {
        images: guild?.iconUrl ? [guild.iconUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error fetching guild metadata:', error);
    
    return {
      title: 'Dashboard',
      description: 'Dashboard do Salazar',
    };
  }
}

export default async function Dashboard({ params }) {
  const { guildId } = await params;

  return (
    <div className={styles.body}>
      <Header />
      <Settings guildId={guildId} />
    </div>
  );
}