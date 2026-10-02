import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { getPublicationTitle } from '../utils/bibliography';

const PublicationTitle = ({ record }: { record: AnPham.IRecord }) => {
	const { main, additional } = getPublicationTitle(record);
	return (
		<div>
			<div>{main}</div>
			{additional.length > 0 && <div style={{ marginTop: 4, color: '#595959' }}>{additional.join(' ; ')}</div>}
		</div>
	);
};

export default PublicationTitle;
