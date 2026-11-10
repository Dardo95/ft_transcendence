import { useLanguage } from '../locales/useLanguage';
import { Icons } from '../components/ui/icons';

import member1Avatar from '../assets/member1.jpg';
import member2Avatar from '../assets/member2.png';
import member3Avatar from '../assets/member3.jpg';
import member4Avatar from '../assets/member4.jpg';
import defaultAvatar from '../assets/default.jpg';

interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
  roleKey: string;
  defaultRole: string;
  contributionsKey: string;
  defaultContributions: string;
  githubUrl: string;
  githubName: string;
  linkedinUrl: string;
  linkedinName: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Oliver Zamora',
    avatarUrl: member1Avatar,
    roleKey: 'app.aboutUs.roles.frontendLead',
    defaultRole: 'Project Manager QA & Frontend Lead Developer',
    contributionsKey: 'app.aboutUs.contributions.member1',
    defaultContributions:
      'Frontend implementation, client-side routing and page development, i18n multi-language engine, User/friendship management interface and Chat',
    githubUrl: 'https://github.com/OliverKingz',
    githubName: 'OliverKingz',
    linkedinUrl: 'https://linkedin.com/in/oliver-king-zamora',
    linkedinName: 'Oliver King Zamora',
  },
  {
    id: 'member-2',
    name: 'Brenda Rivera',
    avatarUrl: member2Avatar,
    roleKey: 'app.aboutUs.roles.frontendArchitect',
    defaultRole: 'Product Owner & Frontend Architect/Designer',
    contributionsKey: 'app.aboutUs.contributions.member2',
    defaultContributions:
      'Frontend architecture, illustration creation, page development, and game frontend design.',
    githubUrl: 'https://github.com/briveraarg',
    githubName: 'briveraarg',
    linkedinUrl: 'https://linkedin.com/in/brenrivera',
    linkedinName: 'Brenda Rivera',
  },
  {
    id: 'member-3',
    name: 'Raúl Pérez',
    avatarUrl: member3Avatar,
    roleKey: 'app.aboutUs.roles.backendLead',
    defaultRole: 'Backend Lead Developer & Real-time/Game Engine',
    contributionsKey: 'app.aboutUs.contributions.member3',
    defaultContributions:
      'User authentication + JWT and Google, WebSocket implementation, chat functionality, live matchmaking and game engine',
    githubUrl: 'https://github.com/RaulPerezDEV',
    githubName: 'RaulPerezDEV',
    linkedinUrl: 'https://linkedin.com/in/raúl-pérez-5b530114a',
    linkedinName: 'Raúl Pérez',
  },
  {
    id: 'member-4',
    name: 'Eduardo Nogueira',
    avatarUrl: member4Avatar,
    roleKey: 'app.aboutUs.roles.devopsLead',
    defaultRole: 'Technical Architect & DevOps Engineer',
    contributionsKey: 'app.aboutUs.contributions.member4',
    defaultContributions:
      'Docker Compose deployment orchestration, Nginx reverse proxy, prisma ORM with seed, user authentification, friend relationship management, and avatar management.',
    githubUrl: 'https://github.com/Dardo95',
    githubName: 'Dardo95',
    linkedinUrl: 'https://linkedin.com/in/eduardo-nogueira-santo-tomás-68b691144/',
    linkedinName: 'Eduardo Nogueira',
  },
];

export function AboutUsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex w-full justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <span>👥</span>
            <span>42 Madrid Team</span>
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {t('app.aboutUs.title') || 'About Us'}
          </h1>
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {t('app.aboutUs.subtitle') ||
              'Four 42 Madrid developers building a real-time multiplayer arcade experience driven by modern software architecture.'}
          </p>
        </section>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900"
            >
              {/* Member Top Area: Avatar & Name */}
              <div className="flex items-start gap-4">
                {/* Circular Avatar */}
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-orange-500/40 bg-zinc-800 p-0.5">
                  <img
                    src={member.avatarUrl || defaultAvatar}
                    alt={member.name}
                    className="size-full rounded-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold text-white">
                    {member.name}
                  </h2>
                  <span className="inline-block rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-medium text-orange-400">
                    {t(member.roleKey) || member.defaultRole}
                  </span>
                </div>
              </div>

              {/* Contributions & Assigned Work */}
              <div className="my-4 flex-1">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {t('app.aboutUs.contributionsLabel') || 'Work & Contributions'}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-300">
                  {t(member.contributionsKey) || member.defaultContributions}
                </p>
              </div>

              {/* Social Links (GitHub & LinkedIn) */}
              <div className="flex items-center gap-3 border-t border-zinc-800/80 pt-4">
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} GitHub`}
                  className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
                >
                  <Icons.gitHub className="size-4 fill-current" />
                  <span>{member.githubName}</span>
                </a>

                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} LinkedIn`}
                  className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
                >
                  <Icons.linkedIn className="size-4 fill-current" />
                  <span>{member.linkedinName}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}