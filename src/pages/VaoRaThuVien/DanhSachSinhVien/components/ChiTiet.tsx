import dayjs from '@/utils/dayjs';
import { Button, Descriptions, Modal, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const ChiTietSinhVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { record } = useModel('quanlythuvien.vaorathuvien');
	const intl = useIntl();

	return (
		<Modal
			title={intl.formatMessage({ id: 'vaorathuvien.card.title.chiTietSVVaoRaThuVien' })}
			open={visible}
			width={800}
			footer={null}
			onCancel={() => setVisible(false)}
		>
			<Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.maSinhVien' })}>
					{record?.maSv ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.hoTen' })}>
					{record?.hoTen ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.ngaySinh' })}>
					{record?.ngaySinh ? dayjs(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.soDienThoai' })}>
					{record?.soDienThoai ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.khoaSinhVien' })}>
					{record?.tenKhoaSinhVien ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.nganhDaoTao' })}>
					{record?.tenNganh ?? '--'}
				</Descriptions.Item>

				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianVao' })}>
					{record?.thoiGianCheckIn ? (
						<>
							{intl.formatMessage({ id: 'vaorathuvien.label.buoi' })} {record?.buoi ?? '--'},{' '}
							{dayjs(record?.thoiGianCheckIn).format('HH:mm DD/MM/YYYY')}
						</>
					) : (
						<Tag color='red'>{intl.formatMessage({ id: 'vaorathuvien.label.chuaVao' })}</Tag>
					)}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianRa' })}>
					{record?.thoiGianCheckOut ? (
						dayjs(record?.thoiGianCheckOut).format('HH:mm DD/MM/YYYY')
					) : (
						<Tag color='red'>{intl.formatMessage({ id: 'vaorathuvien.label.chuaRa' })}</Tag>
					)}
				</Descriptions.Item>
			</Descriptions>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ChiTietSinhVien;
