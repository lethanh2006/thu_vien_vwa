import { colorTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/SinhVien/constant';
import { type ETrangThaiNhanSu, MapColorETrangThaiNhanSu } from '@/services/ToChucNhanSu/constant';
import dayjs from '@/utils/dayjs';
import { Avatar, Col, Descriptions, Row, Tag } from 'antd';
import { useModel } from 'umi';

const InforNguoiMuon = (props: { isSinhVien: boolean }) => {
	const { isSinhVien } = props;
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recCanBo } = useModel('tochucnhansu.nhansu');

	return (
		<Row gutter={16}>
			<Col xs={24} sm={6} md={4}>
				<Avatar
					size={128}
					src={isSinhVien ? recSinhVien?.anhDaiDienUrl : recCanBo?.urlAnhDaiDien}
					style={{ border: '1px solid #f0f0f0' }}
				>
					{/* Hiển thị chữ cái đầu nếu không có avatar */}
					{isSinhVien
						? recSinhVien?.ten?.charAt(0)
						: [recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ').charAt(0)}
				</Avatar>
			</Col>

			{/* Cột thông tin */}
			<Col xs={24} sm={18} md={20}>
				<Descriptions column={{ xs: 1, sm: 1, md: 3 }} title='Thông tin người mượn' size='small'>
					{isSinhVien ? (
						<>
							<Descriptions.Item label='Họ tên'>
								<b>{recSinhVien?.ten ?? '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Mã SV'>
								<b>{recSinhVien?.ma ?? '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Ngày sinh'>
								<b>{recSinhVien?.ngaySinh ? dayjs(recSinhVien?.ngaySinh).format('DD/MM/YYYY') : '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Lớp'>
								<b>{recSinhVien?.tenLopHanhChinhVirtual ?? '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Khóa sinh viên'>
								<b>{recSinhVien?.khoaSinhVien?.ten ?? '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Trạng thái học'>
								<b>
									<Tag color={colorTrangThaiHocSv[recSinhVien?.trangThaiHoc as ETrangThaiHocSv]}>
										{recSinhVien?.trangThaiHoc ?? '--'}
									</Tag>
								</b>
							</Descriptions.Item>
							<Descriptions.Item label='Ngành'>
								<b>{recSinhVien?.nganh?.ten ?? '--'}</b>
							</Descriptions.Item>
						</>
					) : (
						<>
							<Descriptions.Item label='Họ tên'>
								<b>{[recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ')}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Mã cán bộ'>
								<b>{recCanBo?.maCanBo ?? '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Ngày sinh'>
								<b>{recCanBo?.ngaySinh ? dayjs(recCanBo?.ngaySinh).format('DD/MM/YYYY') : '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Đơn vị'>
								<b>{recCanBo?.donViChinh?.ten ?? '--'}</b>
							</Descriptions.Item>
							<Descriptions.Item label='Trạng thái'>
								<b>
									<Tag color={MapColorETrangThaiNhanSu[recCanBo?.trangThai as ETrangThaiNhanSu]}>
										{recCanBo?.trangThai ?? '--'}
									</Tag>
								</b>
							</Descriptions.Item>
						</>
					)}
				</Descriptions>
			</Col>
		</Row>
	);
};

export default InforNguoiMuon;
