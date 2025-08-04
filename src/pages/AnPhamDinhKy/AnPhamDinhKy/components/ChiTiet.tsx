import { Button, Card, Descriptions, Image, Typography } from 'antd';
import { useIntl, useModel } from 'umi';

const { Paragraph } = Typography;

const ViewAnPhamDinhKy = () => {
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('anphamdinhky.anphamdinhky');
	return (
		<Card title='Chi tiết Ấn phẩm định kỳ'>
			<Descriptions bordered column={2} size='middle'>
				<Descriptions.Item label='Tên ấn phẩm định kỳ'>{record?.ten ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Mã ấn phẩm định kỳ'>{record?.maAnPhamDinhKy ?? ''}</Descriptions.Item>
				<Descriptions.Item label='ISSN'>{record?.issn ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Cán bộ biên mục'>{record?.canBoBienMuc ?? ''}</Descriptions.Item>

				<Descriptions.Item label='Nhà xuất bản'>{record?.nhaXuatBan ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Nơi xuất bản'>{record?.noiXuatBan ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Năm xuất bản'>{record?.namXuatBan ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Khuôn khổ'>{record?.khuonKho ?? '—'}</Descriptions.Item>

				<Descriptions.Item label='Số trang'>{record?.soTrang ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Đặc điểm vật lý'>{record?.dacDiemVatLy ?? ''}</Descriptions.Item>

				<Descriptions.Item label='Mẫu biên mục'>
					{record?.mauBienMuc?.ten ?? ''} ({record?.mauBienMuc?.ma ?? ''})
				</Descriptions.Item>
				<Descriptions.Item label='Dạng tài liệu'>
					{record?.dangTaiLieu?.ten ?? ''} ({record?.dangTaiLieu?.ma ?? ''})
				</Descriptions.Item>

				<Descriptions.Item label='Kỳ xuất bản'>
					{record?.kyXuatBan?.ten ?? ''} - {record?.kyXuatBan?.moTa ?? ''}
				</Descriptions.Item>

				{record?.anhBiaUrl && (
					<Descriptions.Item label='Ảnh bìa' span={2}>
						<Image width={200} src={record?.anhBiaUrl} alt='Ảnh bìa ấn phẩm' />
					</Descriptions.Item>
				)}

				{record?.tomTat && (
					<Descriptions.Item label='Tóm tắt' span={2}>
						<Paragraph>{record?.tomTat}</Paragraph>
					</Descriptions.Item>
				)}

				{record?.ghiChu && (
					<Descriptions.Item label='Ghi chú' span={2}>
						<Paragraph type='secondary'>{record?.ghiChu}</Paragraph>
					</Descriptions.Item>
				)}
			</Descriptions>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Card>
	);
};

export default ViewAnPhamDinhKy;
