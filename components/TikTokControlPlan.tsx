import styles from "./TikTokControlPlan.module.css";

const deckKeys = [
  "Toggle Chatbot",
  "Toggle TTS",
  "Toggle Sounds",
  "Run Action",
  "Play Alert",
  "Skip Song",
  "Start Timer",
  "Reset Timer",
  "Coin Match",
  "Reset Coin Jar",
  "Viewer Count",
  "Like Count",
];

const freeActionSlots = [
  "Watch Points",
  "Any Gift",
  "Amped Up",
  "Money Gun",
  "Follow Alert",
];

export function TikTokControlPlan() {
  return (
    <article className={`panel ${styles.panel}`} id="tiktok-control-plan">
      <div className="panelHeader">
        <p className="eyebrow">TikTok Live Control</p>
        <h2>TikFinity + Stream Deck Setup</h2>
        <p className="panelIntro">
          Cheap live-show automation first. Mission Control documents the setup; TikFinity and Stream Deck run the live room.
        </p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>TikTok LIVE Studio</h3>
          <ul>
            <li>Open LIVE Chat settings from the chat gear.</li>
            <li>Keep comments, gifts, activity, LIVE status, and real-time viewer count enabled.</li>
            <li>Turn off spam/offensive comment hiding when chatbot messages are being blocked.</li>
            <li>Use pop-out chat if you need comments visible in a second window.</li>
          </ul>
        </section>

        <section className={styles.card}>
          <h3>Mobile LIVE Settings</h3>
          <ul>
            <li>Open Settings, then Comment settings.</li>
            <li>Allow comments should stay on.</li>
            <li>Open Filter comments and disable spam, potentially unkind, and community-flagged filters when testing chatbot visibility.</li>
            <li>Use block keywords for specific words instead of broad filters when possible.</li>
          </ul>
        </section>

        <section className={styles.card}>
          <h3>TikFinity Chatbot</h3>
          <ul>
            <li>Keep chatbot messages slow: recommended 1 message per 15 seconds.</li>
            <li>Avoid links. Use social names and plain wording.</li>
            <li>If a message disappears, type it manually and ask viewers if they can see it.</li>
            <li>Rephrase filtered commands instead of fighting TikTok filters.</li>
          </ul>
        </section>
      </div>

      <div className={styles.gridTwo}>
        <section className={styles.card}>
          <h3>Free Plan Action Slots</h3>
          <ul>
            {freeActionSlots.map((slot) => <li key={slot}>{slot}</li>)}
          </ul>
        </section>

        <section className={styles.card}>
          <h3>Money Gun Action</h3>
          <ul>
            <li>Action name: Money Gun.</li>
            <li>Use Show Animation, Play Audio, and Show Alert.</li>
            <li>Overlay screen: Screen 1.</li>
            <li>Fade in/out on.</li>
            <li>Global cooldown: 5 seconds minimum after testing.</li>
            <li>User cooldown: 15 seconds minimum after testing.</li>
          </ul>
        </section>

        <section className={styles.card}>
          <h3>Command Event Template</h3>
          <ul>
            <li>Trigger: Commenting a command.</li>
            <li>Command example: !boost.</li>
            <li>Required TikTok team level: 0 while testing.</li>
            <li>Required TikFinity points level: 0 while testing.</li>
            <li>Trigger all of these actions: Amped Up.</li>
          </ul>
        </section>

        <section className={styles.card}>
          <h3>Overlay Screen Fix</h3>
          <ul>
            <li>Your overlay screens are offline until their URL is added to OBS or LIVE Studio.</li>
            <li>Add Screen 1 URL as a Browser Source or Link Source.</li>
            <li>After adding it, TikFinity should change Screen 1 from Offline to Ready.</li>
            <li>Use one overlay screen first. Do not configure all eight until Screen 1 works.</li>
          </ul>
        </section>
      </div>

      <p className={styles.warning}>
        Safety rule: TikTok sends chatbot messages through your account. Every automated message needs to follow TikTok rules because your account is responsible for it.
      </p>

      <div className={styles.deck}>
        {deckKeys.map((key) => (
          <div className={styles.key} key={key}>{key}</div>
        ))}
      </div>
    </article>
  );
}
