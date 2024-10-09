import { colorTrangThaiNopThuVien, type ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import { Card, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ChiTietDanhSach = (props: any) => {
	const { title } = props;
	const { record } = useModel('quanlythuvien.danhsachdot');

	return (
		<Card title={`Chi tiết ${title?.toLowerCase()}`}>
			<Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} labelStyle={{ fontWeight: 600 }}>
				<Descriptions.Item label='Tên đề tài' span={24}>
					{record?.tenDeTai ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Người hướng dẫn'>{record?.nguoiHuongDan ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã học viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Họ tên tác giả'>{record?.hoTenTacGia ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{record?.sinhVien?.ngaySinh ? moment(record?.sinhVien?.ngaySinh).format('DD/MM/YYYY') : 'Không có'}
				</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{record?.sinhVien?.soDienThoai ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Nơi công tác'>{record?.noiCongTac ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					{record?.trangThai ? (
						<Tag color={colorTrangThaiNopThuVien[record?.trangThai as ETrangThaiNopThuVien]}>{record?.trangThai}</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Chức danh'>{record?.chucDanh ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Học vị'>{record?.hocVi ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Chuyên ngành'>{record?.nganh?.ten ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã chuyên ngành'>{record?.maNganh ?? '--'}</Descriptions.Item>
			</Descriptions>
		</Card>
	);
};

export default ChiTietDanhSach;
