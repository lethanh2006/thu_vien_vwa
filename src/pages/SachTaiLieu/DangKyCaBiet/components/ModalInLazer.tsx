import SelectDinhDangMaVach from '@/pages/DanhMuc/MauDinhDang/components/Select';
import rules from '@/utils/rules';
import { Button, Form, Modal } from 'antd';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';

const ModalInLazer = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const [form] = Form.useForm();
	const { selectedIds } = useModel('sachtailieu.anpham.anphamxepgia');
	const { danhSach } = useModel('danhmuc.maudinhdang');

	const [barcodeImages, setBarcodeImages] = useState<string[]>([]);
	const printRef = useRef<HTMLDivElement>(null);

	// Hàm gửi ZPL đến Labelary API và nhận ảnh
	const fetchBarcodeImage = async (zpl: string): Promise<string> => {
		const url = 'https://cors-anywhere.herokuapp.com/http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/';
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/zpl' },
			body: zpl,
		});

		if (!response.ok) throw new Error('Lỗi khi tạo mã vạch');

		const blob = await response.blob();
		return URL.createObjectURL(blob);
	};

	// Hàm xử lý khi nhấn "In"
	const onFinish = async (values: any) => {
		const selectedTemplate = danhSach?.find((item) => item?.ma === values.maMau);
		if (!selectedTemplate?.noiDungMau) {
			console.error('Không tìm thấy nội dung mẫu');
			return;
		}

		// Thay thế `<$copynumber0$>` bằng ID thực tế
		const zplList = selectedIds?.map((id) => selectedTemplate.noiDungMau.replace(/\<\$copynumber0\$\>/g, id)) ?? [];

		try {
			const images = await Promise.all(zplList.map(fetchBarcodeImage));
			setBarcodeImages(images);
		} catch (error) {
			console.error('Lỗi khi tạo ảnh mã vạch:', error);
		}
	};

	// Xử lý in bằng react-to-print
	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});

	return (
		<Modal title='In ra máy in Lazer' visible={visible} onCancel={() => setVisible(false)} footer={null}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='maMau' label='Mẫu' rules={[...rules.required]}>
					<SelectDinhDangMaVach isSetRecord selectMa />
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						Tạo mã vạch
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>

			{/* Khu vực hiển thị mã vạch */}
			{barcodeImages.length > 0 && (
				<div>
					<div ref={printRef} style={{ textAlign: 'center', marginTop: 20 }}>
						{barcodeImages.map((src, index) => (
							<img key={index} src={src} alt={`Barcode ${index}`} style={{ marginBottom: 10 }} />
						))}
					</div>

					<Button type='primary' onClick={handlePrint} style={{ marginTop: 20 }}>
						In mã vạch
					</Button>
				</div>
			)}
		</Modal>
	);
};

export default ModalInLazer;
