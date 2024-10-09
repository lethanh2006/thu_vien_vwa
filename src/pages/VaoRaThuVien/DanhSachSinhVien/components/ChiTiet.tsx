import { Button, Descriptions, Modal, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ChiTietSinhVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { record } = useModel('quanlythuvien.vaorathuvien');

	return (
		<Modal
			title='Xem chi tiết'
			visible={visible}
			width={800}
			footer={
				<div className='form-footer'>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			}
			onCancel={() => {
				setVisible(false);
			}}
		>
			<Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} labelStyle={{ fontWeight: '600' }}>
				<Descriptions.Item label='Mã SV'>{record?.maSv ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Họ và tên'>{record?.hoTen ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{record?.ngaySinh ? moment(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Khóa sinh viên'>{record?.tenKhoaSinhVien ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{record?.soDienThoai ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Ngành đào tạo'>{record?.tenNganh ?? '--'}</Descriptions.Item>

				<Descriptions.Item label='Thời gian vào'>
					{record?.thoiGianCheckIn ? (
						<>
							Buổi {record?.buoi ?? '--'}, {moment(record?.thoiGianCheckIn).format('HH:mm DD/MM/YYYY')}
						</>
					) : (
						<Tag color='red'>Chưa vào</Tag>
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian ra'>
					{record?.thoiGianCheckOut ? (
						moment(record?.thoiGianCheckOut).format('HH:mm DD/MM/YYYY')
					) : (
						<Tag color='red'>Chưa ra</Tag>
					)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ChiTietSinhVien;
