"use client"

import { useState, useRef, useEffect } from "react"
import Select from 'react-select';
import styles from "./Settings.module.css"
import { HiChevronRight } from "react-icons/hi";
import LoadingWheel from "./LoadingWheel";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Form from "next/form";
import ToggleSwitch from "./ToggleSwitch";
import useNtPopups from 'ntpopups';

function TabSelector({ selected, onSelect, guildId, guild }) {
  const tabs = ["Preferências", "Administração", "Cargos", "Inteligência Artificial", "Passagem de tempo", "Roleplay", "Diplomacia e NPCs", "Ações secretas", "Escolha de países"]

  const navRef = useRef(null);

  return (
    <div className={[styles.nav, styles.active].join(' ')} ref={navRef}>
      <section className={styles.guildInfo}>
        <Image src={guild.iconUrl} width={50} height={50} alt={`Ícone de ${guild.name}`} />
        <h1>{guild.name}</h1>
      </section>

      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={selected == tab ? styles.selected : ''}
        >
          {tab}
        </button>
      ))}
      <HiChevronRight className={[styles.mobileOpen, styles.rotated].join(' ')} size={32} onClick={(ev) => {
        navRef?.current?.classList.toggle(styles.active);
        ev.currentTarget.classList.toggle(styles.rotated)
      }} />
    </div>
  )
}

/**
 * @param {import("react").FormEvent<HTMLFormElement>} event 
 */
function sendForm(event, guildId, openPopup) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const data = {};
  const form = event.currentTarget;

  // Processa todos os campos do formulário diretamente (mais previsível que FormData para nossos hidden inputs)
  const elements = Array.from(form.querySelectorAll('input[name], textarea[name], select[name]'));

  for (const el of elements) {
    const name = el.name;
    if (!name) continue;

    // Hidden inputs usados pelos react-select múltiplos
    if (el.type === 'hidden' && (name === 'channels.actions' || name === 'channels.events')) {
      const raw = el.value;
      let arr = [];
      if (typeof raw === 'string' && raw.trim() !== '') {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) arr = parsed.map(String).filter(v => v !== '');
          else arr = [String(parsed)];
        } catch {
          arr = raw.split(',').map(v => v.trim()).filter(v => v !== '');
        }
      }
      // Sempre envie array, nunca null
      data[name] = Array.isArray(arr) ? arr : [];
      continue;
    }

    // Checkboxes
    if (el.type === 'checkbox') {
      data[name] = el.checked;
      continue;
    }

    // Select múltiplo nativo
    if (el.tagName === 'SELECT' && el.multiple) {
      const vals = Array.from(el.selectedOptions).map(o => o.value).filter(v => v !== '');
      data[name] = vals.map(String);
      continue;
    }

    // Número
    if (el.type === 'number') {
      data[name] = el.value === '' ? undefined : Number(el.value);
      continue;
    }

    // Text/textarea
    if (el.tagName === 'TEXTAREA' || el.type === 'text' || el.type === 'search') {
      data[name] = el.value;
      continue;
    }

    // Select simples
    if (el.tagName === 'SELECT') {
      data[name] = el.value === 'undefined' || el.value === '' ? undefined : el.value;
      continue;
    }

    // Fallback
    data[name] = el.value;
  }

  // Processa campos que devem ser apagados: se o elemento tem um valor anterior, mas agora está ausente/ vazio
  for (const el of elements) {
    if (!el.name) continue;
    if (el.type === 'checkbox') continue;
    const name = el.name;
    const prevHasValue = el.defaultValue || el.hasAttribute('data-has-value');
    const current = data[name];
    const isEmptyArray = Array.isArray(current) && current.length === 0;
    // Nunca envie null para actions/events, sempre array
    if ((current === undefined || current === '' || (isEmptyArray && name !== 'channels.actions' && name !== 'channels.events')) && prevHasValue) {
      data[name] = null;
    }
  }

  console.log('📤 Dados a enviar:', data);

  fetch("/api/save_config", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      guildId,
      data
    })
  })
    .then(r => {
      if (!r.ok) throw r
      return r.json()
    })
    .then(result => {
      console.log('✅ Salvo:', result);
      openPopup('generic', {
        data: {
          title: 'Sucesso!',
          message: 'Configurações salvas com sucesso.',
          closeLabel: 'OK'
        }
      });
    })
    .catch((e) => {
      console.error('❌ Erro ao salvar:', e);
      openPopup('generic', {
        data: {
          title: 'Erro ao salvar configurações',
          message: e?.toString() || 'Erro desconhecido',
          closeLabel: 'OK'
        }
      });
    });
}

function SettingsContent({ selected, guildId, guild, guildChannels, guildRoles }) {

  const { openPopup } = useNtPopups();
  const actionsInputRef = useRef(null);
  const eventsInputRef = useRef(null);

  // Sincroniza os hidden inputs com os dados iniciais
  useEffect(() => {
    // extrai arrays robustamente (aceita JSON string, CSV string ou array)
    const normalize = (v) => {
      if (Array.isArray(v)) return v.map(String);
      if (typeof v === 'string') {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed.map(String);
        } catch {}
        return v.split(',').map(s => s.trim()).filter(s => s !== '');
      }
      return [];
    };

    if (actionsInputRef.current) {
      const arr = normalize(guild?.config?.server?.channels?.actions);
      actionsInputRef.current.value = JSON.stringify(arr);
    }
    if (eventsInputRef.current) {
      const arr = normalize(guild?.config?.server?.channels?.events);
      eventsInputRef.current.value = JSON.stringify(arr);
    }
  }, [guild]);

  const pages = {
    "Preferências": <Form className={styles.config} key={'preferencias'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>

      <section>
        <h2>Configuração geral</h2>

        <div className={styles.option}>
          <label htmlFor="name">Nome do servidor</label>
          <p>{'Se você usar {ano} em alguma parte do nome, o Salazar atualizará o nome do servidor toda vez que o ano do roleplay for passado.'}</p>
          <input type="text" name="name" id="name" defaultValue={guild?.config?.server?.name} required />
        </div>

        <div className={styles.option}>
          <label htmlFor="preferences.extra_prompt">Prompt adicional</label>
          <p>Caso você queira algum detalhe ou especificação extra nas narrações do seu servidor.</p>
          <textarea name="preferences.extra_prompt" id="preferences.extra_prompt" defaultValue={guild?.config?.server?.preferences?.extra_prompt} placeholder="Ex.: Penalize o jogador e realce os resultados negativos das suas ações (caso você queira priorizar narração humana e usar o Salazar para agilidade mas com desvantagem)." />
        </div>
      </section>

      <section>
        <h2>Definições de tempo e tamanho</h2>

        <div className={styles.option}>
          <label htmlFor="preferences.action_timing">Segundos para enviar partes da ação</label>
          <p>O tempo em que o Salazar esperará (em segundos) para que o jogador envie todas as mensagens que comporão sua ação.</p>
          <input type="number" name="preferences.action_timing" id="preferences.action_timing" defaultValue={guild?.config?.server?.preferences?.action_timing} placeholder="20" />
        </div>

        <div className={styles.option}>
          <label htmlFor="preferences.min_event_length">Mínimo de caracteres de evento</label>
          <p>Mínimo de caracteres de uma mensagem de narrador em canal de evento para que o Salazar a armazene em sua memória como um evento.</p>
          <input type="number" name="preferences.min_event_length" id="preferences.min_event_length" defaultValue={guild?.config?.server?.preferences?.min_event_length} placeholder="256" />
        </div>

        <div className={styles.option}>
          <label htmlFor="preferences.min_action_length">Mínimo de caracteres de ação</label>
          <p>Mínimo de caracteres de uma mensagem de jogador em canal de ação para que o Salazar a identifique como uma ação e narre seus resultados.</p>
          <input type="number" name="preferences.min_action_length" id="preferences.min_action_length" defaultValue={guild?.config?.server?.preferences?.min_action_length} placeholder="500" />
        </div>

        <div className={styles.option}>
          <label htmlFor="preferences.min_diplomacy_length">Mínimo de caracteres de diplomacia</label>
          <p>Mínimo de caracteres de uma mensagem de jogador no canal de diplomacia para que o Salazar a leia e tente interpretar seus resultados para simular resposta de um país NPC, criar chat de guerra, etc.</p>
          <input type="number" name="preferences.min_diplomacy_length" id="preferences.min_diplomacy_length" defaultValue={guild?.config?.server?.preferences?.min_diplomacy_length} placeholder="200" />
        </div>

        <div className={styles.option}>
          <label htmlFor="preferences.action_keyword">Palavra-chave que identifica ações</label>
          <p>Palavra-chave que caso a mensagem enviada em um canal de ações contenha, o Salazar irá tentar narrá-la mesmo se ela não atingir o mínimo de caracteres.</p>
          <input type="text" name="preferences.action_keyword" id="preferences.action_keyword" defaultValue={guild?.config?.server?.preferences?.action_keyword} placeholder="acao" />
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Administração": <Form className={styles.config} key={'administracao'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>

      <section>
        <div className={styles.option}>
          <label htmlFor="channels.staff">Canal da administração</label>
          <p>Canal principal da administração do servidor.</p>
          <select name="channels.staff" id="channels.staff" defaultValue={guild?.config?.server?.channels?.staff} required>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.logs">Canal de registros</label>
          <p>Canal onde o Salazar irá registrar usos do bot como comandos e botões pressionados.</p>
          <select name="channels.logs" id="channels.logs" defaultValue={guild?.config?.server?.channels?.logs} required>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Cargos": <Form className={styles.config} key={'cargos'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>

      <section>
        <div className={styles.option}>
          <label htmlFor="roles.player">Cargo de jogador</label>
          <p>Cargo atribuído a todos os jogadores participantes do roleplay</p>
          <select name="roles.player" id="roles.player" defaultValue={guild?.config?.server?.roles?.player} required>
            {guildRoles.map(r => {
              return <option key={r.id} value={r.id}>{r.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="roles.non_player">Cargo de não jogador</label>
          <p>Cargo atribuído a todos os membros não participantes do roleplay</p>
          <select name="roles.non_player" id="roles.non_player" defaultValue={guild?.config?.server?.roles?.non_player} required>
            {guildRoles.map(r => {
              return <option key={r.id} value={r.id}>{r.name}</option>
            })}
          </select>
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Inteligência Artificial": <Form className={styles.config} key={'inteligenciaArtificial'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>

      <section>
        <div className={styles.option}>
          <label htmlFor="channels.context">Canal da memória do bot</label>
          <p>Um fórum onde todos os acontecimentos do roleplay são registrados em ordem cronológica, controlando a memória do Salazar.</p>
          <select name="channels.context" id="channels.context" defaultValue={guild?.config?.server?.channels?.context} required>
            {guildChannels.filter(c => c.type == 15).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="preferences.global_palpites">Responder jogadores com IA</label>
          <p>O Salazar responderá com IA a qualquer jogador que o mencionar, de forma similar ao comando /palpite. No entanto, ele usará um modelo mais fraco.</p>
          <ToggleSwitch type="checkbox" name="preferences.global_palpites" id="preferences.global_palpites" defaultChecked={guild?.config?.server?.preferences?.global_palpites} />
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Passagem de tempo": <Form className={styles.config} key={'passagemDeTempo'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>
      <p>A passagem de tempo automática do Salazar é opcional, e você pode optar por passar anos apenas manualmente: basta não definir os dias para passar o ano.</p>

      <section>
        <div className={styles.option}>
          <label htmlFor="preferences.days_to_year">Dias para passar um ano</label>
          <p>Quantos dias da vida real são necessários para que o Salazar passe um ano do roleplay.</p>
          <input type="number" name="preferences.days_to_year" id="preferences.days_to_year" defaultValue={guild?.config?.server?.preferences?.days_to_year} placeholder="Indefinido (sem passagem automática)" />
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.time">Canal de passagem do tempo</label>
          <p>Canal (geralmente chamado calendário) onde um administrador anuncia a passagem de tempo do roleplay. Caso a passagem automática esteja ativada, também será onde o Salazar irá anunciar.</p>
          <select name="channels.time" id="channels.time" defaultValue={guild?.config?.server?.channels?.time} required>
            {guildChannels.filter(c => c.type == 0 || c.type == 5).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Roleplay": <Form className={styles.config} key={'roleplay'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>

      <section>
        <div className={styles.option}>
          <label htmlFor="channels.actions">Canais de ações</label>
          <p>Todos os canais de ações, onde os jogadores enviam ações para que sejam narradas.</p>
          <Select
            inputId="channels.actions"
            isMulti
            options={guildChannels.filter(c => c.type == 0 || c.type == 4 || c.type == 5 || c.type == 15).map(c => ({ value: String(c.id), label: c.name }))}
            defaultValue={(() => {
              const actionsRaw = guild?.config?.server?.channels?.actions;
              let actionsArray = [];
              if (Array.isArray(actionsRaw)) actionsArray = actionsRaw.map(String);
              else if (typeof actionsRaw === 'string') {
                try {
                  const parsed = JSON.parse(actionsRaw);
                  if (Array.isArray(parsed)) actionsArray = parsed.map(String);
                  else actionsArray = [String(parsed)];
                } catch {
                  actionsArray = actionsRaw.split(',').map(s => s.trim()).filter(s => s !== '');
                }
              }
              const opts = guildChannels.filter(c => c.type == 0 || c.type == 4 || c.type == 5 || c.type == 15).map(c => ({ value: String(c.id), label: c.name }));
              return opts.filter(o => actionsArray.includes(o.value));
            })()}
            onChange={selected => {
              if (actionsInputRef.current) {
                actionsInputRef.current.value = JSON.stringify(selected ? selected.map(opt => String(opt.value)) : []);
                actionsInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.286)',
                backgroundColor: state.isFocused ? 'white' : 'rgba(255,255,255,0.671)',
                boxShadow: 'none',
                minHeight: '48px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: '0.2s ease-in-out',
              }),
              menu: base => ({ ...base, zIndex: 9999, borderRadius: '12px', fontSize: '16px' }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? 'rgba(255,255,255,0.542)'
                  : state.isFocused
                  ? 'rgba(255,255,255,0.671)'
                  : 'rgba(255,255,255,0.671)',
                color: 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: '0.2s ease-in-out',
              }),
              multiValue: base => ({
                ...base,
                backgroundColor: 'rgba(19,173,19,0.15)',
                borderRadius: '8px',
                color: 'black',
              }),
              multiValueLabel: base => ({
                ...base,
                color: 'black',
                fontWeight: 600,
              }),
              multiValueRemove: base => ({
                ...base,
                color: 'black',
                ':hover': {
                  backgroundColor: 'rgba(19,173,19,0.3)',
                  color: 'black',
                },
              }),
              placeholder: base => ({
                ...base,
                color: 'rgba(0,0,0,0.5)',
              }),
              input: base => ({
                ...base,
                color: 'black',
              }),
            }}
          />
          {/* Hidden input para enviar no form */}
          <input type="hidden" name="channels.actions" id="channels.actions" ref={actionsInputRef} defaultValue="[]" />
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.events">Canais de eventos</label>
          <p>Todos os canais de eventos, onde os administradores enviam acontecimentos do roleplay. O Salazar precisa saber esses canais para poder registrar eventos na sua memória.</p>
          <Select
            inputId="channels.events"
            isMulti
            options={guildChannels.filter(c => c.type == 0 || c.type == 4 || c.type == 5 || c.type == 15).map(c => ({ value: String(c.id), label: c.name }))}
            defaultValue={(() => {
              const eventsRaw = guild?.config?.server?.channels?.events;
              let eventsArray = [];
              if (Array.isArray(eventsRaw)) eventsArray = eventsRaw.map(String);
              else if (typeof eventsRaw === 'string') {
                try {
                  const parsed = JSON.parse(eventsRaw);
                  if (Array.isArray(parsed)) eventsArray = parsed.map(String);
                  else eventsArray = [String(parsed)];
                } catch {
                  eventsArray = eventsRaw.split(',').map(s => s.trim()).filter(s => s !== '');
                }
              }
              const opts = guildChannels.filter(c => c.type == 0 || c.type == 4 || c.type == 5 || c.type == 15).map(c => ({ value: String(c.id), label: c.name }));
              return opts.filter(o => eventsArray.includes(o.value));
            })()}
            onChange={selected => {
              if (eventsInputRef.current) {
                eventsInputRef.current.value = JSON.stringify(selected ? selected.map(opt => String(opt.value)) : []);
                eventsInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.286)',
                backgroundColor: state.isFocused ? 'white' : 'rgba(255,255,255,0.671)',
                boxShadow: 'none',
                minHeight: '48px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: '0.2s ease-in-out',
              }),
              menu: base => ({ ...base, zIndex: 9999, borderRadius: '12px', fontSize: '16px' }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? 'rgba(255,255,255,0.542)'
                  : state.isFocused
                  ? 'rgba(255,255,255,0.671)'
                  : 'rgba(255,255,255,0.671)',
                color: 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: '0.2s ease-in-out',
              }),
              multiValue: base => ({
                ...base,
                backgroundColor: 'rgba(19,173,19,0.15)',
                borderRadius: '8px',
                color: 'black',
              }),
              multiValueLabel: base => ({
                ...base,
                color: 'black',
                fontWeight: 600,
              }),
              multiValueRemove: base => ({
                ...base,
                color: 'black',
                ':hover': {
                  backgroundColor: 'rgba(19,173,19,0.3)',
                  color: 'black',
                },
              }),
              placeholder: base => ({
                ...base,
                color: 'rgba(0,0,0,0.5)',
              }),
              input: base => ({
                ...base,
                color: 'black',
              }),
            }}
          />
          <input type="hidden" name="channels.events" id="channels.events" ref={eventsInputRef} defaultValue="[]" />
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.narrations">Canal de narrações</label>
          <p>Canal onde o Salazar irá publicar narrações de ações. Ações feitas nos canais privados de países (pl) não serão narradas aqui.</p>
          <select name="channels.narrations" id="channels.narrations" defaultValue={guild?.config?.server?.channels?.narrations} required>
            {guildChannels.filter(c => c.type == 0 || c.type == 5).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.war">Canal de guerra</label>
          <p>Fórum onde o Salazar poderá narrar guerras (caso sejam declaradas no chat de diplomacia). As guerras criadas aqui e narradas por humanos também serão lembradas pelo Salazar.</p>
          <select name="channels.war" id="channels.war" defaultValue={guild?.config?.server?.channels?.war || 'undefined'} required>
            <option value="undefined">Nenhum canal</option>
            {guildChannels.filter(c => c.type == 15).map(c => {
              return <option key={c.id} value={c.id} defaultChecked={c.id == guild?.config?.server?.channels?.war}>{c.name}</option>
            })}
          </select>
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Diplomacia e NPCs": <Form className={styles.config} key={'diplomaciaENpcs'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>
      <p>As funções diplomáticas são opcionais e podem ser desativadas, bastando não definir o canal da função.</p>

      <section>
        <div className={styles.option}>
          <label htmlFor="channels.diplomacy">Canal de diplomacia</label>
          <p>Canal destinado a ações diplomáticas especificamente. Aqui, o Salazar irá ler declarações de guerra para criar o canal adequado no fórum de guerras, além de simular interações diplomáticas entre os jogadores e países NPCs.</p>
          <select name="channels.diplomacy" id="channels.diplomacy" defaultValue={guild?.config?.server?.channels?.diplomacy || 'undefined'} required>
            <option value="undefined">Nenhum canal</option>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.npc_random_actions">NPC - Ações aleatórias</label>
          <p>Canal onde países NPCs enviarão ações aleatórias que condizem com o roleplay. Caso você não queira países NPCs fazendo ações, não defina esta opção.</p>
          <select name="channels.npc_random_actions" id="channels.npc_random_actions" defaultValue={guild?.config?.server?.channels?.npc_random_actions || 'undefined'} required>
            <option value="undefined">Nenhum canal</option>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Ações secretas": <Form className={styles.config} key={'acoesSecretas'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>
      <p>Feature opcional para caso seu servidor não tenha canais privados de países e você queira uma alternativa para fazer ações secretas. Se você não quiser a usar, não defina os canais.</p>

      <section>
        <div className={styles.option}>
          <label htmlFor="channels.secret_actions">Canal de ações secretas</label>
          <p>Canal onde os jogadores enviarão ações secretas. Assim que enviadas, o Salazar apaga-as imediatamente e envia-as no canal administrativo de ações secretas.</p>
          <select name="channels.secret_actions" id="channels.secret_actions" defaultValue={guild?.config?.server?.channels?.secret_actions || 'undefined'} required>
            <option value="undefined">Nenhum canal</option>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.secret_actions_log">Canal administrativo de ações secretas</label>
          <p>Canal onde os administradores podem ler ações secretas para narrá-las manualmente.</p>
          <select name="channels.secret_actions_log" id="channels.secret_actions_log" defaultValue={guild?.config?.server?.channels?.secret_actions_log || 'undefined'} required>
            <option value="undefined">Nenhum canal</option>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
    "Escolha de países": <Form className={styles.config} key={'escolhaDePaises'} onSubmit={(e) => sendForm(e, guildId, openPopup)}>
      <h1>{selected}</h1>
      <p>Feature opcional que automatiza a escolha de países, criação de chats privados, cargos e emojis. Se você não quiser usar, não defina nenhum dos canais. Se quiser, tem que definir todos.</p>

      <section>
        <div className={styles.option}>
          <label htmlFor="channels.country_category">Categoria de chat dos países</label>
          <p>Categoria do seu servidor onde o Salazar irá criar e gerenciar os canais individuais de cada país automaticamente.</p>
          <select name="channels.country_category" id="channels.country_category" defaultValue={guild?.config?.server?.channels?.country_category || 'undefined'} required>
            <option value="undefined">Nenhuma categoria</option>
            {guildChannels.filter(c => c.type == 4).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.country_picking">Canal de escolha de país</label>
          <p>Canal onde o Salazar possibilitará que os jogadores peçam países. Não se preocupe, a administração precisa aprovar os jogadores após o pedido.</p>
          <select name="channels.country_picking" id="channels.country_picking" defaultValue={guild?.config?.server?.channels?.country_picking || 'undefined'} required>
            <option value="undefined">Nenhum canal</option>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>

        <div className={styles.option}>
          <label htmlFor="channels.picked_countries">Canal de países escolhidos</label>
          <p>Canal onde os países que possuem jogadores são informados. Mais de uma pessoa podem controlar o mesmo país.</p>
          <select name="channels.picked_countries" id="channels.picked_countries" defaultValue={guild?.config?.server?.channels?.picked_countries || 'undefined'} required>
            <option value="undefined">Nenhum canal</option>
            {guildChannels.filter(c => c.type == 0).map(c => {
              return <option key={c.id} value={c.id}>{c.name}</option>
            })}
          </select>
        </div>
      </section>

      <section>
        <button className={styles.saveButton} type="submit">Salvar</button>
      </section>
    </Form>,
  }

  return pages[selected] || <p>Selecione uma aba</p>
}

export default function Settings({ guildId }) {
  const { data: session } = useSession();

  const [selectedTab, setSelectedTab] = useState("Preferências")
  const [guild, setGuild] = useState(null)
  const [guildChannels, setGuildChannels] = useState(null)
  const [guildRoles, setGuildRoles] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!guildId) return

    setLoading(true)

    Promise.all([
      fetch(`/api/discord/guild?id=${guildId}`)
        .then(async res => {
          if (!res.ok) {
            const json = await res.json().catch(() => null)
            throw json || { message: "Erro desconhecido nos servidores" }
          }
          return res.json()
        }),

      fetch(`https://cowapi.nemtudo.me/api/get_channels?guildId=${guildId}`)
        .then(async res => {
          if (!res.ok) {
            const json = await res.json().catch(() => null)
            throw json || { message: "Erro desconhecido nos canais" }
          }
          return res.json()
        }),

      fetch(`https://cowapi.nemtudo.me/api/get_roles?guildId=${guildId}`)
        .then(async res => {
          if (!res.ok) {
            const json = await res.json().catch(() => null)
            throw json || { message: "Erro desconhecido nos cargos" }
          }
          return res.json()
        })
    ])
      .then(([guildData, channelsData, rolesData]) => {
        console.log('✅ Servidor recebido:', guildData)
        console.log('✅ Canais recebidos:', channelsData)
        console.log('✅ Cargos recebidos:', rolesData)
        setGuild(guildData)
        setGuildChannels(channelsData)
        setGuildRoles(rolesData)
      })
      .catch(err => {
        console.error('❌ Erro:', err)
        setError(err)
      })
      .finally(() => {
        console.log('🏁 Loading finalizado')
        setLoading(false)
      })

  }, [guildId])

  // Use o estado de loading ao invés de checar as variáveis
  if (loading) {
    return <div className={styles.loading}><LoadingWheel /></div>
  }

  // Mostre erro se houver
  if (error) {
    return <div className={styles.error}>Erro: {error.message}</div>
  }

  // Mostre mensagem se não encontrou os dados
  if (!guild || !guildChannels || !guildRoles) {
    return <div className={styles.error}>Dados não encontrados</div>
  }

  return (
    <div className={styles.dashboard}>
      <TabSelector selected={selectedTab} onSelect={setSelectedTab} guildId={guild?.id || guildId} guild={guild} />
      <SettingsContent selected={selectedTab} guildId={guild?.id || guildId} guild={guild} guildChannels={guildChannels} guildRoles={guildRoles} />
    </div>
  )
}