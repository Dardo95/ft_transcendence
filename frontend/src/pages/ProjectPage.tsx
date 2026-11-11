import { useLanguage } from '../locales/useLanguage';

interface ModuleItem {
  id: string;
  categoryKey: string;
  defaultCategory: string;
  nameKey: string;
  defaultName: string;
  typeKey: string;
  defaultType: string;
  points: number;
  descriptionKey: string;
  defaultDescription: string;
}

const MANDATORY_MODULES: ModuleItem[] = [
  {
    id: 'm-web-frameworks',
    categoryKey: 'app.aboutProject.categories.web',
    defaultCategory: 'Web',
    nameKey: 'app.aboutProject.modules.frameworks.title',
    defaultName: 'Frontend & Backend Frameworks',
    typeKey: 'app.aboutProject.types.major',
    defaultType: 'Major',
    points: 2,
    descriptionKey: 'app.aboutProject.modules.frameworks.desc',
    defaultDescription:
      'React + Vite on client, NestJS modular architecture on server.',
  },
  {
    id: 'm-web-sockets',
    categoryKey: 'app.aboutProject.categories.web',
    defaultCategory: 'Web',
    nameKey: 'app.aboutProject.modules.websockets.title',
    defaultName: 'Real-time WebSockets',
    typeKey: 'app.aboutProject.types.major',
    defaultType: 'Major',
    points: 2,
    descriptionKey: 'app.aboutProject.modules.websockets.desc',
    defaultDescription:
      'Low-latency Socket.io server-authoritative ticks and event loop.',
  },
  {
    id: 'm-user-interaction',
    categoryKey: 'app.aboutProject.categories.web',
    defaultCategory: 'Web',
    nameKey: 'app.aboutProject.modules.interaction.title',
    defaultName: 'User Interaction & Social',
    typeKey: 'app.aboutProject.types.major',
    defaultType: 'Major',
    points: 2,
    descriptionKey: 'app.aboutProject.modules.interaction.desc',
    defaultDescription:
      'Global and lobby chat, public profiles, and live friend status.',
  },
  {
    id: 'm-user-management',
    categoryKey: 'app.aboutProject.categories.userMgmt',
    defaultCategory: 'User Management',
    nameKey: 'app.aboutProject.modules.userMgmt.title',
    defaultName: 'Standard User Management & Auth',
    typeKey: 'app.aboutProject.types.major',
    defaultType: 'Major',
    points: 2,
    descriptionKey: 'app.aboutProject.modules.userMgmt.desc',
    defaultDescription:
      'Argon2id password hashing, JWT HTTP-only cookies, and avatar upload.',
  },
  {
    id: 'm-gaming-game',
    categoryKey: 'app.aboutProject.categories.gaming',
    defaultCategory: 'Gaming & UX',
    nameKey: 'app.aboutProject.modules.game.title',
    defaultName: 'Complete Web-Based Game',
    typeKey: 'app.aboutProject.types.major',
    defaultType: 'Major',
    points: 2,
    descriptionKey: 'app.aboutProject.modules.game.desc',
    defaultDescription:
      'Real-time 2D Bomberman arena with clear rules and win/loss states.',
  },
  {
    id: 'm-gaming-remote',
    categoryKey: 'app.aboutProject.categories.gaming',
    defaultCategory: 'Gaming & UX',
    nameKey: 'app.aboutProject.modules.remote.title',
    defaultName: 'Remote Players Support',
    typeKey: 'app.aboutProject.types.major',
    defaultType: 'Major',
    points: 2,
    descriptionKey: 'app.aboutProject.modules.remote.desc',
    defaultDescription:
      'Synchronized remote gameplay across separate devices with reconnect logic.',
  },
  {
    id: 'm-gaming-multiplayer',
    categoryKey: 'app.aboutProject.categories.gaming',
    defaultCategory: 'Gaming & UX',
    nameKey: 'app.aboutProject.modules.multiplayer.title',
    defaultName: 'Multiplayer 3+ Players',
    typeKey: 'app.aboutProject.types.major',
    defaultType: 'Major',
    points: 2,
    descriptionKey: 'app.aboutProject.modules.multiplayer.desc',
    defaultDescription:
      'Concurrent 4-player deathmatch with real-time state synchronization.',
  },
];

const BONUS_MODULES: ModuleItem[] = [
  {
    id: 'b-orm',
    categoryKey: 'app.aboutProject.categories.web',
    defaultCategory: 'Web',
    nameKey: 'app.aboutProject.modules.orm.title',
    defaultName: 'Database ORM Integration',
    typeKey: 'app.aboutProject.types.minor',
    defaultType: 'Minor',
    points: 1,
    descriptionKey: 'app.aboutProject.modules.orm.desc',
    defaultDescription:
      'Prisma ORM schema, strong typings, migrations, and PostgreSQL relations.',
  },
  {
    id: 'b-i18n',
    categoryKey: 'app.aboutProject.categories.a11y',
    defaultCategory: 'Accessibility & i18n',
    nameKey: 'app.aboutProject.modules.i18n.title',
    defaultName: 'Multi-Language Support (3+)',
    typeKey: 'app.aboutProject.types.minor',
    defaultType: 'Minor',
    points: 1,
    descriptionKey: 'app.aboutProject.modules.i18n.desc',
    defaultDescription:
      'Internationalization engine supporting English, Spanish, and Italian.',
  },
  {
    id: 'b-customization',
    categoryKey: 'app.aboutProject.categories.gaming',
    defaultCategory: 'Gaming & UX',
    nameKey: 'app.aboutProject.modules.customization.title',
    defaultName: 'Game Customization & Power-ups',
    typeKey: 'app.aboutProject.types.minor',
    defaultType: 'Minor',
    points: 1,
    descriptionKey: 'app.aboutProject.modules.customization.desc',
    defaultDescription:
      'Dynamic power-up pickups (blast radius, extra bombs, speed boots).',
  },
  {
    id: 'b-stats',
    categoryKey: 'app.aboutProject.categories.userMgmt',
    defaultCategory: 'User Management',
    nameKey: 'app.aboutProject.modules.stats.title',
    defaultName: 'Game Statistics & Match History',
    typeKey: 'app.aboutProject.types.minor',
    defaultType: 'Minor',
    points: 1,
    descriptionKey: 'app.aboutProject.modules.stats.desc',
    defaultDescription:
      'Player match records, win/loss tracking, and leaderboard rankings.',
  },
  {
    id: 'b-spectator',
    categoryKey: 'app.aboutProject.categories.gaming',
    defaultCategory: 'Gaming & UX',
    nameKey: 'app.aboutProject.modules.spectator.title',
    defaultName: 'Spectator Mode',
    typeKey: 'app.aboutProject.types.minor',
    defaultType: 'Minor',
    points: 1,
    descriptionKey: 'app.aboutProject.modules.spectator.desc',
    defaultDescription:
      'Live spectator view for ongoing arena matches without player input lag.',
  },
];

export function ProjectPage() {
  const { t } = useLanguage();

  const mandatoryTotal = MANDATORY_MODULES.reduce(
    (sum, item) => sum + item.points,
    0
  );
  const bonusTotal = BONUS_MODULES.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="flex w-full justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-orange-400 uppercase">
            <span>⚙️</span>
            <span>42 Transcendence v21.2</span>
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {t('app.aboutProject.title') || 'About the Project'}
          </h1>
          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {t('app.aboutProject.subtitle') ||
              'Especificación técnica, arquitectura del sistema y desglose de módulos evaluados según la normativa oficial (v21.2).'}
          </p>

          {/* Quick Score Counter */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-zinc-300">
              <span className="text-zinc-400">
                {t('app.aboutProject.summaryMandatory') || 'Mandatory'}:{' '}
              </span>
              <span className="text-orange-400">{mandatoryTotal} pts</span> (Min
              14 pts)
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-zinc-300">
              <span className="text-zinc-400">
                {t('app.aboutProject.summaryBonus') || 'Bonus'}:{' '}
              </span>
              <span className="text-amber-400">+{bonusTotal} pts</span> (Max 5
              pts)
            </div>
          </div>
        </section>

        {/* Mandatory Modules Table */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">
              {t('app.aboutProject.mandatoryHeading') ||
                'Mandatory Core Modules'}
            </h2>
            <span className="text-xs font-semibold text-orange-400">
              {mandatoryTotal}{' '}
              {t('app.aboutProject.pointsLabel') || 'Points Claimed'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 tracking-wider text-zinc-400 uppercase">
                <tr>
                  <th className="px-4 py-3">
                    {t('app.aboutProject.colModule') || 'Module'}
                  </th>
                  <th className="px-4 py-3">
                    {t('app.aboutProject.colCategory') || 'Category'}
                  </th>
                  <th className="px-4 py-3">
                    {t('app.aboutProject.colType') || 'Type'}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t('app.aboutProject.colPoints') || 'Points'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {MANDATORY_MODULES.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-800/40"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">
                        {t(item.nameKey) || item.defaultName}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {t(item.descriptionKey) || item.defaultDescription}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-zinc-400">
                      {t(item.categoryKey) || item.defaultCategory}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-block rounded border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-400">
                        {t(item.typeKey) || item.defaultType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold whitespace-nowrap text-white">
                      {item.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bonus Modules Table */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">
              {t('app.aboutProject.bonusHeading') ||
                'Bonus Modules (Max 5 pts)'}
            </h2>
            <span className="text-xs font-semibold text-amber-400">
              {bonusTotal}{' '}
              {t('app.aboutProject.pointsLabel') || 'Points Claimed'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 tracking-wider text-zinc-400 uppercase">
                <tr>
                  <th className="px-4 py-3">
                    {t('app.aboutProject.colModule') || 'Module'}
                  </th>
                  <th className="px-4 py-3">
                    {t('app.aboutProject.colCategory') || 'Category'}
                  </th>
                  <th className="px-4 py-3">
                    {t('app.aboutProject.colType') || 'Type'}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t('app.aboutProject.colPoints') || 'Points'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {BONUS_MODULES.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-800/40"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">
                        {t(item.nameKey) || item.defaultName}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {t(item.descriptionKey) || item.defaultDescription}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-zinc-400">
                      {t(item.categoryKey) || item.defaultCategory}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-block rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                        {t(item.typeKey) || item.defaultType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold whitespace-nowrap text-white">
                      {item.points} pt
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
