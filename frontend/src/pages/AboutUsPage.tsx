import { useLanguage } from '../locales/useLanguage';
import { Icons } from '../components/ui/icons';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';
import { Bomb } from 'lucide-react';

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
  school42Name: string;
  bombermanUrl: string;
  bombermanName: string;
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
    school42Name: 'ozamora-',
    bombermanUrl: '/profile/ozamora-',
    bombermanName: 'ozamora-',
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
    school42Name: 'brivera',
    bombermanUrl: '/profile/brivera',
    bombermanName: 'brivera',
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
    school42Name: 'raperez-',
    bombermanUrl: '/profile/raperez-',
    bombermanName: 'raperez-',
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
    linkedinUrl:
      'https://linkedin.com/in/eduardo-nogueira-santo-tomás-68b691144/',
    linkedinName: 'Eduardo Nogueira',
    school42Name: 'enogueir',
    bombermanUrl: '/profile/enogueir',
    bombermanName: 'enogueir',
  },
];

export function AboutUsPage() {
  const { t } = useLanguage();

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        {/* Header Section */}
        <Card className={UI.card.header}>
          <div className={UI.badge.header}>
            <span>42 Madrid Team</span>
          </div>

          <h1 className={UI.text.pageTitle}>
            {t('app.aboutUs.title') || 'About Us'}
          </h1>
          <p className={UI.text.pageSubtitle}>
            {t('app.aboutUs.subtitle') ||
              'Four 42 Madrid developers building a real-time multiplayer arcade experience driven by modern software architecture.'}
          </p>
        </Card>

        {/* Team Members Grid */}
        <section className={UI.shell.grid2}>
          {TEAM_MEMBERS.map((member) => (
            <Card
              key={member.id}
              className={`${UI.card.section} ${UI.row.interactive} flex flex-col justify-between`}
            >
              {/* Member Top Area: Avatar & Name */}
              <div className="flex items-start gap-4">
                {/* Circular Avatar */}
                <div className="border-primary/40 bg-secondary relative size-16 shrink-0 overflow-hidden rounded-full border-2 p-0.5">
                  <img
                    src={member.avatarUrl || defaultAvatar}
                    alt={member.name}
                    className={`${UI.avatar.full} rounded-full`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-foreground truncate text-lg font-bold">
                    {member.name}
                  </h2>
                  <span className="border-input bg-secondary text-primary inline-block rounded-md border px-2 py-0.5 text-xs font-medium">
                    {t(member.roleKey) || member.defaultRole}
                  </span>
                </div>
              </div>

              {/* Contributions & Assigned Work */}
              <div className="my-4 flex-1">
                <h3 className={`mb-1 ${UI.text.sublabel}`}>
                  {t('app.aboutUs.contributionsLabel') ||
                    'Work & Contributions'}
                </h3>
                <p className={UI.text.body}>
                  {t(member.contributionsKey) || member.defaultContributions}
                </p>
              </div>

              {/* Social Links (GitHub, LinkedIn, School42, Bomberman Account) */}
              <div className="border-border/80 grid grid-cols-2 gap-3 border-t pt-4">
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} GitHub`}
                  className={UI.btn.social}
                >
                  <Icons.gitHub
                    className={`${UI.icon.sm} shrink-0 fill-current`}
                  />
                  <span className="truncate">{member.githubName}</span>
                </a>

                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} LinkedIn`}
                  className={UI.btn.social}
                >
                  <Icons.linkedIn
                    className={`${UI.icon.sm} shrink-0 fill-current`}
                  />
                  <span className="truncate">{member.linkedinName}</span>
                </a>

                <a
                  href={member.bombermanUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} Bomberman Account`}
                  className={UI.btn.social}
                >
                  <Bomb className={`${UI.icon.sm} shrink-0`} />
                  <span className="truncate">{member.bombermanName}</span>
                </a>

                <a
                  href={`https://profile.intra.42.fr/users/${member.school42Name}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} 42 School Profile`}
                  className={UI.btn.social}
                >
                  <Icons.school42
                    className={`${UI.icon.sm} shrink-0 fill-current`}
                  />
                  <span className="truncate">{member.school42Name}</span>
                </a>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
