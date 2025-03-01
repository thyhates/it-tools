import { LockSquare } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.bcc-checker.title'),
  path: '/bcc-checker',
  description: translate('tools.bcrypt.description'),
  keywords: ['bcc', 'checker'],
  component: () => import('./bcc-checker.vue'),
  icon: LockSquare,
});
