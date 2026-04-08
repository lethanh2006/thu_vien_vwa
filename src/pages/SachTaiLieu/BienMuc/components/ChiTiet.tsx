import { Descriptions, Image, theme } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useModel } from 'umi';

const ChiTietBienMuc = () => {
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
			<Descriptions.Item label='Ảnh'>
				{record?.urlScanBia ? (
					<Image src={record.urlScanBia} alt='Ảnh' width={120} style={{ objectFit: 'cover' }} />
				) : (
					'--'
				)}
			</Descriptions.Item>

			<Descriptions.Item label='Sổ đăng ký tổng quát'>{record?.dotNhapSach?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Cán bộ biên mục'>{record?.canBoBienMuc ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='Nhan đề chính [245$a]'>{record?.nhanDe ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Tác giả [100$a]'>{record?.tacGia ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='Kiểu bản ghi'>{record?.kieuBanGhi?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Dạng tài liệu [927]'>{record?.dangTaiLieu?.ten ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='Cấp thư mục'>{record?.capThuMuc?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Vật mang tin [025]'>{record?.vatMangTin?.ten ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='Mẫu biên mục'>{record?.mauBienMuc?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Độ mật [926]'>{record?.doMat ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='ISBN [020$a]'>{getValue('020', '$a')}</Descriptions.Item>
			<Descriptions.Item label='ISSN [022$a]'>{getValue('022', '$a')}</Descriptions.Item>

			<Descriptions.Item label='Số thứ tự của tập [245$n]'>{getValue('245', '$n')}</Descriptions.Item>
			<Descriptions.Item label='Tên tập [245$p]'>{getValue('245', '$p')}</Descriptions.Item>

			<Descriptions.Item label='Phụ đề [245$b]'>{getValue('245', '$b')}</Descriptions.Item>
			<Descriptions.Item label='Thông tin trách nhiệm [245$c]'>{getValue('245', '$c')}</Descriptions.Item>

			<Descriptions.Item label='Lần xuất bản [250$a]'>{getValue('250', '$a')}</Descriptions.Item>
			<Descriptions.Item label='Nơi xuất bản [260$a]'>{getValue('260', '$a')}</Descriptions.Item>

			<Descriptions.Item label='Năm xuất bản [260$c]'>{getValue('260', '$c')}</Descriptions.Item>
			<Descriptions.Item label='Nhà xuất bản [260$b]'>{getValue('260', '$b')}</Descriptions.Item>

			<Descriptions.Item label='Số trang [300$a]'>{getValue('300', '$a')}</Descriptions.Item>
			<Descriptions.Item label='Đặc điểm vật lý [300$b]'>{getValue('300', '$b')}</Descriptions.Item>

			<Descriptions.Item label='Khuôn khổ [300$c]'>{getValue('300', '$c')}</Descriptions.Item>
			<Descriptions.Item label='Tư liệu đi kèm [300$e]'>{getValue('300', '$e')}</Descriptions.Item>
		</Descriptions>
	);
};

export default ChiTietBienMuc;
