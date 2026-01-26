import { Descriptions, theme } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';

const ChiTietBienMuc = () => {
	const intl = useIntl();
	const { token } = theme.useToken();
	const { record } = useModel('sachtailieu.anpham.anpham');
	const { danhSach } = useModel('sachtailieu.anpham.thongtinanpham');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	const getValue = (tag: string, code: string) =>
		danhSach?.find((item) => item?.tagCode === tag)?.thuocTinhAnPham?.find((i) => i.code === code)?.value ?? '--';

	return (
		<Descriptions
			bordered
			column={isMobile ? 1 : 2}
			labelStyle={{
				width: 170,
				whiteSpace: 'normal',
				fontWeight: 500,
				color: token.colorTextSecondary,
				background: '#fafafa',
			}}
			contentStyle={{
				wordBreak: 'break-word',
				whiteSpace: 'pre-wrap',
			}}
		>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.soDangKyTongQuat' })}>
				{record?.dotNhapSach?.ten ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.canBoBienMuc' })}>
				{record?.canBoBienMuc ?? '--'}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhanDeChinh' })}>
				{record?.nhanDe ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.tacGia' })}>
				{record?.tacGia ?? '--'}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.kieuBanGhi' })}>
				{record?.kieuBanGhi?.ten ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.dangTaiLieu' })}>
				{record?.dangTaiLieu?.ten ?? '--'}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.capThuMuc' })}>
				{record?.capThuMuc?.ten ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.vatMangTin' })}>
				{record?.vatMangTin?.ten ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.mauBienMuc' })}>
				{record?.mauBienMuc?.ten ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.doMat' })}>
				{record?.doMat ?? '--'}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.isbn' })}>
				{getValue('020', '$a')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.issn' })}>
				{getValue('022', '$a')}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.soThuTuCuaTap' })}>
				{getValue('245', '$n')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.tenTap' })}>
				{getValue('245', '$p')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.phuDe' })}>
				{getValue('245', '$b')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.thongTinTrachNhiem' })}>
				{getValue('245', '$c')}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.lanXuatBan' })}>
				{getValue('250', '$a')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.noiXuatBan' })}>
				{getValue('260', '$a')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.namXuatBan' })}>
				{getValue('260', '$c')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.nhaXuatBan' })}>
				{getValue('260', '$b')}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.soTrang' })}>
				{getValue('300', '$a')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.dacDiemVatLy' })}>
				{getValue('300', '$b')}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.khuonKho' })}>
				{getValue('300', '$c')}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.bienmuc.tuLieuDiKem' })}>
				{getValue('300', '$e')}
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ChiTietBienMuc;
