import Header from "@/components/Header";
import styles from "./page.module.css";
import LoadingWheel from "@/components/LoadingWheel";
import GuildInfo from "@/components/GuildInfo";
import Settings from "@/components/Settings";

export default async function Dashboard({ params }) {
  const { guildId } = await params;

  return (
    <div className={styles.body}>
      <Header />
      <Settings />
    </div>
  );
}