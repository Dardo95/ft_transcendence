import { useLanguage } from '../locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

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
  // Kept for reference in case the module is used again.
  // {
  //   id: 'b-stats',
  //   categoryKey: 'project.categories.userMgmt',
  //   defaultCategory: 'User Management',
  //   nameKey: 'project.modules.stats.title',
  //   defaultName: 'Game statistics and match history',
  //   typeKey: 'project.types.minor',
  //   defaultType: 'Minor',
  //   points: 1,
  //   requirementsKey: 'project.modules.stats.requirements',
  // },
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
    id: 'b-oauth',
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

// Extra modules are currently empty on purpose.
const EXTRA_MODULES: ModuleItem[] = [];

type ModuleAccent = 'orange' | 'amber' | 'gray';

const ACCENT_CLASSES: Record<ModuleAccent, string> = {
  orange: 'border-primary/30 bg-primary/10 text-primary',
  amber: 'border-accent/30 bg-accent/10 text-accent',
  gray: 'border-input bg-secondary text-muted-foreground',
};

interface ModuleTableProps {
  modules: ModuleItem[];
  accent: ModuleAccent;
}

function ModuleTable({ modules, accent }: ModuleTableProps) {
  const { t, tList } = useLanguage();

  return (
    <div className={UI.table.wrapper}>
      <table className={UI.table.base}>
        <thead className={UI.table.head}>
          <tr>
            <th className={UI.table.cell}>
              {t('project.colModule') || 'Module'}
            </th>
            <th className={UI.table.cell}>
              {t('project.colCategory') || 'Category'}
            </th>
            <th className={UI.table.cell}>{t('project.colType') || 'Type'}</th>
            <th className={UI.table.cellRight}>
              {t('project.colPoints') || 'Points'}
            </th>
          </tr>
        </thead>
        <tbody className={`text-secondary-foreground ${UI.table.dividerList}`}>
          {modules.map((item) => {
            const requirements = tList(item.requirementsKey);

            return (
              <tr key={item.id} className={UI.table.row}>
                <td className="px-4 py-4">
                  <div className="text-foreground text-sm font-semibold">
                    {t(item.nameKey) || item.defaultName}
                  </div>
                  {requirements.length > 0 && (
                    <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed">
                      {requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="text-muted-foreground px-4 py-4 align-top whitespace-nowrap">
                  {t(item.categoryKey) || item.defaultCategory}
                </td>
                <td className="px-4 py-4 align-top whitespace-nowrap">
                  <span
                    className={`${UI.badge.type} ${ACCENT_CLASSES[accent]}`}
                  >
                    {t(item.typeKey) || item.defaultType}
                  </span>
                </td>
                <td className="text-foreground px-4 py-4 text-right align-top font-bold whitespace-nowrap">
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
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        {/* Header Section */}
        <Card className={UI.card.header}>
          <div className={UI.badge.header}>
            <span>{t('project.versionBadge') || '42 Transcendence v21.2'}</span>
          </div>

          <h1 className={UI.text.pageTitle}>
            {t('project.title') || 'About the Project'}
          </h1>
          <p className={UI.text.pageSubtitle}>
            {t('project.subtitle') ||
              'Technical specification, system architecture, and module breakdown evaluated under the official 42 guidelines (v21.2).'}
          </p>

          {/* Quick Score Counter */}
          <div className="mt-4 mb-6 flex w-full flex-wrap justify-center gap-4 text-xs font-semibold">
            <div className={UI.badge.metaPill}>
              <span className="text-muted-foreground">
                {t('project.summaryMandatory') || 'Mandatory'}:{' '}
              </span>
              <span className="text-primary">
                {mandatoryTotal} {t('project.pts') || 'pts'}
              </span>{' '}
              <span className="text-muted-foreground/70">
                ({t('project.minPoints') || 'Min 14 pts'})
              </span>
            </div>
            <div className={UI.badge.metaPill}>
              <span className="text-muted-foreground">
                {t('project.summaryBonus') || 'Bonus'}:{' '}
              </span>
              <span className="text-accent">
                +{bonusTotal} {t('project.pts') || 'pts'}
              </span>{' '}
              <span className="text-muted-foreground/70">
                ({t('project.maxPoints') || 'Max 5 pts'})
              </span>
            </div>
          </div>

          {/* Github Link to the project repository */}
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 bottom-4 mt-10 gap-2"
            asChild
          >
            <a
              href="https://github.com/Dardo95/ft_transcendence"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={
                t('project.repositoryAria') || 'Project GitHub repository'
              }
            >
              <Icons.gitHub className={`${UI.icon.sm} shrink-0 fill-current`} />
              {t('project.repository') || 'Repository'}
            </a>
          </Button>
        </Card>

        {/* Mandatory Modules Table */}
        <Card className={UI.card.section}>
          <div className={`mb-4 ${UI.row.header}`}>
            <h2 className={UI.text.sectionTitle}>
              {t('project.mandatoryHeading') || 'Mandatory Core Modules'}
            </h2>
            <span className="text-primary text-xs font-semibold">
              {mandatoryTotal} {t('project.pointsLabel') || 'Points Claimed'}
            </span>
          </div>

          <ModuleTable modules={MANDATORY_MODULES} accent="orange" />
        </Card>

        {/* Bonus Modules Table */}
        <Card className={`mb-8 ${UI.card.section}`}>
          <div className={`mb-4 ${UI.row.header}`}>
            <h2 className={UI.text.sectionTitle}>
              {t('project.bonusHeading') || 'Bonus Modules (Max 5 pts)'}
            </h2>
            <span className="text-accent text-xs font-semibold">
              {bonusTotal} {t('project.pointsLabel') || 'Points Claimed'}
            </span>
          </div>

          <ModuleTable modules={BONUS_MODULES} accent="amber" />
        </Card>

        {/* Extra Modules */}
        <Card className={UI.card.section}>
          <h2 className={UI.text.sectionTitle}>
            {t('project.extraHeading') || 'Extra Modules'}
          </h2>
          <p className={UI.text.muted}>
            {t('project.extraDesc') ||
              'Additional modules or features that are not part of the mandatory or bonus criteria but may enhance the project.'}
          </p>

          {EXTRA_MODULES.length > 0 && (
            <div className="mt-4">
              <ModuleTable modules={EXTRA_MODULES} accent="gray" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
