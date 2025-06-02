import { colorTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/SinhVien/constant';
import { type ETrangThaiNhanSu, MapColorETrangThaiNhanSu } from '@/services/ToChucNhanSu/constant';
import { Descriptions, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const InforNguoiMuon = (props: { isSinhVien: boolean }) => {
	const { isSinhVien } = props;
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recCanBo } = useModel('tochucnhansu.nhansu');

	return (
		<Descriptions column={{ xs: 1, sm: 1, md: 4 }} title='Thông tin người mượn'>
			{isSinhVien ? (
				<>
					<Descriptions.Item label='Họ tên'>
						<b>{recSinhVien?.ten ?? '--'}</b>
					</Descriptions.Item>
					<Descriptions.Item label='Mã SV'>
						<b>{recSinhVien?.ma ?? '--'}</b>
					</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh'>
						<b>{recSinhVien?.ngaySinh ? moment(recSinhVien?.ngaySinh).format('DD/MM/YYYY') : '--'}</b>
					</Descriptions.Item>
					<Descriptions.Item label='Lớp'>
						<b>{recSinhVien?.tenLopHanhChinhVirtual ?? '--'}</b>
					</Descriptions.Item>
					<Descriptions.Item label='Khóa sinh viên'>
						<b>{recSinhVien?.khoaSinhVien?.ten ?? '--'}</b>
					</Descriptions.Item>
					<Descriptions.Item label='Ngành'>
						<b>{recSinhVien?.nganh?.ten ?? '--'}</b>
					</Descriptions.Item>
					<Descriptions.Item label='Trạng thái học'>
						<b>
							<Tag color={colorTrangThaiHocSv[recSinhVien?.trangThaiHoc as ETrangThaiHocSv]}>
								{recSinhVien?.trangThaiHoc ?? '--'}
							</Tag>
						</b>
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
						<b>{recCanBo?.ngaySinh ? moment(recCanBo?.ngaySinh).format('DD/MM/YYYY') : '--'}</b>
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
	);
};

export default InforNguoiMuon;
