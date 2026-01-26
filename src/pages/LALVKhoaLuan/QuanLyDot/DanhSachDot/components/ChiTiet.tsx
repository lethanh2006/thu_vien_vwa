import { colorTrangThaiNopThuVien, type ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import dayjs from '@/utils/dayjs';
import { Card, Descriptions, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const ChiTietDanhSach = (props: any) => {
	const intl = useIntl();
	const { title } = props;
	const { record } = useModel('quanlythuvien.danhsachdot');

	return (
		<Card title={`${intl.formatMessage({ id: 'luananluanvankhoaluan.card.title.chiTiet' })} ${title?.toLowerCase()}`}>
			<Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} labelStyle={{ fontWeight: 600 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDeTai' })} span={24}>
					{record?.tenDeTai ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nguoiHuongDan' })}>
					{record?.nguoiHuongDan ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.maSinhVien' })}>
					{record?.maSinhVien ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.hoTenTacGia' })}>
					{record?.hoTenTacGia ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.ngaySinh' })}>
					{record?.sinhVien?.ngaySinh
						? dayjs(record?.sinhVien?.ngaySinh).format('DD/MM/YYYY')
						: intl.formatMessage({ id: 'luananluanvankhoaluan.label.khongCo' })}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.soDienThoai' })}>
					{record?.sinhVien?.soDienThoai ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.noiCongTac' })}>
					{record?.noiCongTac ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.trangThai' })}>
					{record?.trangThai ? (
						<Tag color={colorTrangThaiNopThuVien[record?.trangThai as ETrangThaiNopThuVien]}>{record?.trangThai}</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chucDanh' })}>
					{record?.chucDanh ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.hocVi' })}>
					{record?.hocVi ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chuyenNganh' })}>
					{record?.nganh?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.maChuyenNganh' })}>
					{record?.maNganh ?? '--'}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
};

export default ChiTietDanhSach;
