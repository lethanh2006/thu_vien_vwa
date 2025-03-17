import SelectDinhDangMaVach from '@/pages/DanhMuc/MauDinhDang/components/Select';
import { inMaBarCode } from '@/services/SachTaiLieu/AnPham';
import rules from '@/utils/rules';
import { getFilenameHeader } from '@/utils/utils';
import { Button, Form, Modal } from 'antd';
import fileDownload from 'js-file-download';
import { useIntl, useModel } from 'umi';

const ModalInLazer = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const [form] = Form.useForm();
	const { selectedIds } = useModel('sachtailieu.anpham.anphamxepgia');
	const { danhSach, formSubmiting, setFormSubmiting } = useModel('danhmuc.maudinhdang');

	const onFinish = async (values: any) => {
		const selectedTemplate = danhSach?.find((item) => item?.ma === values.maMau);
		if (!selectedTemplate?.noiDungMau) {
			console.error('Không tìm thấy nội dung mẫu');
			return;
		}

		const zplList = selectedIds?.map((id) => selectedTemplate.noiDungMau.replace(/\<\$copynumber0\$\>/g, id)) ?? [];

		setFormSubmiting(true);
		try {
			inMaBarCode({ zpl: zplList?.[0] }).then((res) => {
				if (res?.data) {
					fileDownload(res?.data, getFilenameHeader(res));
				}
			});
		} catch (error) {
			console.error('Lỗi khi tạo ảnh mã vạch:', error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Modal title='In ra máy in Lazer' visible={visible} onCancel={() => setVisible(false)} footer={null}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='maMau' label='Mẫu' rules={[...rules.required]}>
					<SelectDinhDangMaVach isSetRecord selectMa />
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary' loading={formSubmiting}>
						Tạo mã vạch
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalInLazer;
