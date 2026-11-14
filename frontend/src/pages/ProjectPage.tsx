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
  requirementsKey: string;
}

const MANDATORY_MODULES: ModuleItem[] = [
  {
    id: 'm-web-frameworks',
    categoryKey: 'project.categories.web',
    defaultCategory: 'Web',
    nameKey: 'project.modules.frameworks.title',
    defaultName: 'Use a framework for both the frontend and backend',
    typeKey: 'project.types.major',
    defaultType: 'Major',
    points: 2,
    requirementsKey: 'project.modules.frameworks.requirements',
  },
  {
    id: 'm-web-sockets',
    categoryKey: 'project.categories.web',
    defaultCategory: 'Web',
    nameKey: 'project.modules.websockets.title',
    defaultName:
      'Implement real-time features using WebSockets or similar technology',
    typeKey: 'project.types.major',
    defaultType: 'Major',
    points: 2,
    requirementsKey: 'project.modules.websockets.requirements',
  },
  {
    id: 'm-user-interaction',
    categoryKey: 'project.categories.web',
    defaultCategory: 'Web',
    nameKey: 'project.modules.interaction.title',
    defaultName: 'Allow users to interact with other users',
    typeKey: 'project.types.major',
    defaultType: 'Major',
    points: 2,
    requirementsKey: 'project.modules.interaction.requirements',
  },
  {
    id: 'm-user-management',
    categoryKey: 'project.categories.userMgmt',
    defaultCategory: 'User Management',
    nameKey: 'project.modules.userMgmt.title',
    defaultName: 'Standard user management and authentication',
    typeKey: 'project.types.major',
    defaultType: 'Major',
    points: 2,
    requirementsKey: 'project.modules.userMgmt.requirements',
  },
  {
    id: 'm-gaming-game',
    categoryKey: 'project.categories.gaming',
    defaultCategory: 'Gaming and user experience',
    nameKey: 'project.modules.game.title',
    defaultName:
      'Implement a complete web-based game where users can play against each other',
    typeKey: 'project.types.major',
    defaultType: 'Major',
    points: 2,
    requirementsKey: 'project.modules.game.requirements',
  },
  {
    id: 'm-gaming-remote',
    categoryKey: 'project.categories.gaming',
    defaultCategory: 'Gaming and user experience',
    nameKey: 'project.modules.remote.title',
    defaultName:
      'Remote players — Enable two players on separate computers to play the same game in real-time',
    typeKey: 'project.types.major',
    defaultType: 'Major',
    points: 2,
    requirementsKey: 'project.modules.remote.requirements',
  },
  {
    id: 'm-gaming-multiplayer',
    categoryKey: 'project.categories.gaming',
    defaultCategory: 'Gaming and user experience',
    nameKey: 'project.modules.multiplayer.title',
    defaultName: 'Multiplayer game (more than two players)',
    typeKey: 'project.types.major',
    defaultType: 'Major',
    points: 2,
    requirementsKey: 'project.modules.multiplayer.requirements',
  },
];

const BONUS_MODULES: ModuleItem[] = [
  {
    id: 'b-orm',
    categoryKey: 'project.categories.web',
    defaultCategory: 'Web',
    nameKey: 'project.modules.orm.title',
    defaultName: 'Use an ORM for the database',
    typeKey: 'project.types.minor',
    defaultType: 'Minor',
    points: 1,
    requirementsKey: 'project.modules.orm.requirements',
  },
  {
    id: 'b-i18n',
    categoryKey: 'project.categories.a11y',
    defaultCategory: 'Accessibility and Internationalization',
    nameKey: 'project.modules.i18n.title',
    defaultName: 'Support for multiple languages (at least 3 languages)',
    typeKey: 'project.types.minor',
    defaultType: 'Minor',
    points: 1,
    requirementsKey: 'project.modules.i18n.requirements',
  },
  {
    id: 'b-customization',
    categoryKey: 'project.categories.gaming',
    defaultCategory: 'Gaming and user experience',
    nameKey: 'project.modules.customization.title',
    defaultName: 'Game customization options',
    typeKey: 'project.types.minor',
    defaultType: 'Minor',
    points: 1,
    requirementsKey: 'project.modules.customization.requirements',
  },
  {
    id: 'b-stats',
    categoryKey: 'project.categories.userMgmt',
    defaultCategory: 'User Management',
    nameKey: 'project.modules.stats.title',
    defaultName: 'Game statistics and match history',
    typeKey: 'project.types.minor',
    defaultType: 'Minor',
    points: 1,
    requirementsKey: 'project.modules.stats.requirements',
  },
  {
    id: 'b-spectator',
    categoryKey: 'project.categories.gaming',
    defaultCategory: 'Gaming and user experience',
    nameKey: 'project.modules.spectator.title',
    defaultName: 'Implement spectator mode for games',
    typeKey: 'project.types.minor',
    defaultType: 'Minor',
    points: 1,
    requirementsKey: 'project.modules.spectator.requirements',
  },
];

const EXTRA_MODULES: ModuleItem[] = [
  {
    id: 'e-oauth',
    categoryKey: 'project.categories.userMgmt',
    defaultCategory: 'User Management',
    nameKey: 'project.modules.oauth.title',
    defaultName:
      'Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.)',
    typeKey: 'project.types.minor',
    defaultType: 'Minor',
    points: 1,
    requirementsKey: 'project.modules.oauth.requirements',
  },
];

type ModuleAccent = 'orange' | 'amber' | 'gray';

const ACCENT_CLASSES: Record<ModuleAccent, string> = {
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  gray: 'border-gray-500/30 bg-gray-500/10 text-gray-400',
};

interface ModuleTableProps {
  modules: ModuleItem[];
  accent: ModuleAccent;
}

function ModuleTable({ modules, accent }: ModuleTableProps) {
  const { t, tList } = useLanguage();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-950/60 text-xs tracking-wider text-zinc-400 uppercase">
          <tr>
            <th className="px-4 py-3">{t('project.colModule') || 'Module'}</th>
            <th className="px-4 py-3">
              {t('project.colCategory') || 'Category'}
            </th>
            <th className="px-4 py-3">{t('project.colType') || 'Type'}</th>
            <th className="px-4 py-3 text-right">
              {t('project.colPoints') || 'Points'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
          {modules.map((item) => {
            const requirements = tList(item.requirementsKey);

            return (
              <tr
                key={item.id}
                className="align-top transition-colors hover:bg-zinc-800/40"
              >
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-white">
                    {t(item.nameKey) || item.defaultName}
                  </div>
                  {requirements.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-zinc-400">
                      {requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-4 align-top whitespace-nowrap text-zinc-400">
                  {t(item.categoryKey) || item.defaultCategory}
                </td>
                <td className="px-4 py-4 align-top whitespace-nowrap">
                  <span
                    className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${ACCENT_CLASSES[accent]}`}
                  >
                    {t(item.typeKey) || item.defaultType}
                  </span>
                </td>
                <td className="px-4 py-4 text-right align-top font-bold whitespace-nowrap text-white">
                  {item.points} {t('project.pts') || 'pts'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ProjectPage() {
  const { t } = useLanguage();

  const mandatoryTotal = MANDATORY_MODULES.reduce(
    (sum, item) => sum + item.points,
    0
  );
  const bonusTotal = BONUS_MODULES.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-orange-400 uppercase">
            <span>42 Transcendence v21.2</span>
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {t('project.title') || 'About the Project'}
          </h1>
          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {t('project.subtitle') ||
              'Technical specification, system architecture, and module breakdown evaluated under the official 42 guidelines (v21.2).'}
          </p>

          {/* Quick Score Counter */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-zinc-300">
              <span className="text-zinc-400">
                {t('project.summaryMandatory') || 'Mandatory'}:{' '}
              </span>
              <span className="text-orange-400">
                {mandatoryTotal} {t('project.pts') || 'pts'}
              </span>{' '}
              <span className="text-zinc-500">
                ({t('project.minPoints') || 'Min 14 pts'})
              </span>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-zinc-300">
              <span className="text-zinc-400">
                {t('project.summaryBonus') || 'Bonus'}:{' '}
              </span>
              <span className="text-amber-400">
                +{bonusTotal} {t('project.pts') || 'pts'}
              </span>{' '}
              <span className="text-zinc-500">
                ({t('project.maxPoints') || 'Max 5 pts'})
              </span>
            </div>
          </div>
        </section>

        {/* Mandatory Modules Table */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">
              {t('project.mandatoryHeading') || 'Mandatory Core Modules'}
            </h2>
            <span className="text-xs font-semibold text-orange-400">
              {mandatoryTotal} {t('project.pointsLabel') || 'Points Claimed'}
            </span>
          </div>

          <ModuleTable modules={MANDATORY_MODULES} accent="orange" />
        </section>

        {/* Bonus Modules Table */}
        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">
              {t('project.bonusHeading') || 'Bonus Modules (Max 5 pts)'}
            </h2>
            <span className="text-xs font-semibold text-amber-400">
              {bonusTotal} {t('project.pointsLabel') || 'Points Claimed'}
            </span>
          </div>

          <ModuleTable modules={BONUS_MODULES} accent="amber" />
        </section>

        {/* Extra Modules */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-bold text-white">
            {t('project.extraHeading') || 'Extra Modules'}
          </h2>
          <p className="text-sm text-zinc-400">
            {t('project.extraDesc') ||
              'Additional modules or features that are not part of the mandatory or bonus criteria but may enhance the project.'}
          </p>

          <div className="mt-4">
            <ModuleTable modules={EXTRA_MODULES} accent="gray" />
          </div>
        </section>
      </div>
    </div>
  );
}
