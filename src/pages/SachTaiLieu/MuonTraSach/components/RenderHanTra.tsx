import { ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import dayjs from '@/utils/dayjs';
import { Tag } from 'antd';

const RenderHanTra = (props: { rec: MuonSach.IRecord }) => {
	const { rec } = props;

	if (!rec?.expired) {
		return <span>-</span>;
	}

	const hanTra = dayjs(rec.expired).startOf('day');
	const ngayTra = rec?.thoiGianTra ? dayjs(rec.thoiGianTra).startOf('day') : null;
	const now = dayjs().startOf('day');

	const expiredText = <div style={{ marginBottom: 4 }}>{hanTra.format('DD/MM/YYYY')}</div>;

	if (rec.trangThai === ETrangThaiMuonSach.DA_TRA && ngayTra) {
		const soNgayQuaHan = ngayTra.diff(hanTra, 'days');

		if (soNgayQuaHan > 0) {
			return (
				<div>
					{expiredText}
					<Tag color='red'>Đã trả muộn {soNgayQuaHan} ngày</Tag>
				</div>
			);
		} else {
			return (
				<div>
					{expiredText}
					<Tag color='green'>Đã trả đúng hạn</Tag>
				</div>
			);
		}
	} else if (rec.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON) {
		const soNgayQuaHan = now.diff(hanTra, 'days');
		const soNgayConLai = hanTra.diff(now, 'days');

		if (soNgayQuaHan > 0) {
			return (
				<div>
					{expiredText}
					<Tag color='red'>Quá hạn {soNgayQuaHan} ngày</Tag>
				</div>
			);
		} else if (soNgayConLai <= 7) {
			return (
				<div>
					{expiredText}
					<Tag color='orange'>Sắp đến hạn</Tag>
				</div>
			);
		} else {
			return (
				<div>
					{expiredText}
					<Tag color='green'>Còn {soNgayConLai} ngày</Tag>
				</div>
			);
		}
	}

	return (
		<div>
			{expiredText}
			<span>-</span>
		</div>
	);
};

export default RenderHanTra;
