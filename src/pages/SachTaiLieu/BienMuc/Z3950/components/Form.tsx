import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, message, Modal, Steps } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import BienMucChiTiet from '../../components/BienMucChiTiet';
import BienMucSoLuoc from '../../components/BienMucSoLuoc';

const FormZ3950 = (props: { visibleForm: boolean; setVisibleForm: (val: boolean) => void }) => {
	const { setVisibleForm, visibleForm } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, formSubmiting, setFormSubmiting, postBienMucSoLuocModel, putBienMucChiTietModel, setVisibleZ3950 } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach, getAllModel } = useModel('danhmuc.truongbienmuc');
	const { danhSach: dsMauBienMuc } = useModel('danhmuc.maubienmuc');
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [actionType, setActionType] = useState<ETrangThaiBienMuc>(ETrangThaiBienMuc.CHO_BIEN_MUC);

	const mauBienMucId: string = Form.useWatch('mauBienMucId', form);

	const mauBienMuc = dsMauBienMuc?.find((item) => item?._id === mauBienMucId);

	useEffect(() => {
		getAllModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, {
			population: [
				{
					path: 'thuocTinh',
				},
			],
		});
	}, []);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else {
			//reset form trước khi setFieldsValue
			resetFieldsForm(form);

			const mergedData = record?.danhSachThongTin?.map((item) => ({
				...item,
				ten: danhSach?.find((i) => i?.ma === item?.tagCode)?.noiDung,
				thuocTinhAnPham: [
					...(item?.thuocTinhAnPham || []).map((tp) => ({
						...tp,
						value: tp.value ?? null,
						ten: danhSach?.find((i) => i?.ma === item?.tagCode)?.thuocTinh?.find((i) => i?.code === tp?.code)?.tieuDe,
					})),
				],
			}));

			form.setFieldsValue({
				...record,
				danhSachBienMucChiTiet: _.orderBy(mergedData, 'tagCode'),
			});
		}
	}, [record, visibleForm]);

	useEffect(() => {
		if (mauBienMuc) {
			const mergedDataMauBienMuc = mauBienMuc?.thongTinKhaiBao?.map((item) => ({
				...item,
				tagCode: item?.tag,
				ten: item?.ten,
				thuocTinhAnPham: [
					...(item?.thuocTinhDuLieu || []).map((tp) => ({
						...tp,
						value: null,
						ten: item?.ten,
					})),
				],
			}));

			const currentList = form.getFieldValue('danhSachBienMucChiTiet') || [];

			const combinedList = [...currentList, ...mergedDataMauBienMuc];

			form.setFieldsValue({
				...record,
				danhSachBienMucChiTiet: _.orderBy(combinedList, 'tagCode'),
			});
		}
	}, [mauBienMucId]);

	const onFinish = async (values: any) => {
		try {
			setFormSubmiting(true);

			const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
			values.urlScanBia = urlScanBia ?? '';
			values.namXuatBan = Number(values.namXuatBan);

			// Tách riêng dữ liệu cho biên mục sơ lược (không bao gồm danhSachBienMucChiTiet)
			const { danhSachBienMucChiTiet, ...bienMucSoLuocData } = values;

			// Gửi biên mục sơ lược
			const res = await postBienMucSoLuocModel({
				...bienMucSoLuocData,
				trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC,
			});

			const newRecordId = res?._id;
			if (!newRecordId) throw new Error('Không nhận được _id từ biên mục sơ lược');

			// Chỉ gửi danhSachBienMucChiTiet khi gọi putBienMucChiTietModel
			if (danhSachBienMucChiTiet) {
				const data = {
					danhSachBienMucChiTiet: danhSachBienMucChiTiet.map((item: any) => ({
						_id: item._id ?? null,
						ind1: item.ind1 ?? null,
						ind2: item.ind2 ?? null,
						tagCode: item.tagCode,
						value: item.value ?? null,
						thuocTinhAnPham: (item.thuocTinhAnPham || []).map((thuocTinh: any) => ({
							code: thuocTinh.code,
							value: thuocTinh.value ?? '',
						})),
					})),
					trangThai: actionType,
				};

				// Gửi biên mục chi tiết
				await putBienMucChiTietModel(newRecordId, data);
			}
		} catch (error: any) {
			console.log('🚀 ~ onFinish ~ error:', error);
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			await onFinish(values).then(() => {
				setVisibleForm(false);
				setVisibleZ3950(false);
				if (actionType === ETrangThaiBienMuc.DA_BIEN_MUC) {
					history.push('/sach-tai-lieu/an-pham');
				}
			});
		} catch (error) {
			const errorFields = (error as any).errorFields;

			if (errorFields && errorFields.length > 0) {
				message.error('Vui lòng kiểm tra lại các trường bắt buộc');
			} else {
				message.error('Có lỗi xảy ra khi kiểm tra dữ liệu');
			}
		}
	};

	const handleNext = async () => {
		try {
			await form.validateFields();
			setCurrentStep(currentStep + 1);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handlePrev = () => {
		setCurrentStep(currentStep - 1);
	};

	return (
		<Modal
			title='Biên mục qua Z39.50'
			width={1200}
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Steps
					current={currentStep}
					type='navigation'
					style={{ marginBottom: 18, paddingTop: 0 }}
					onChange={setCurrentStep}
				>
					<Steps.Step title='Biên mục sơ lược' />
					<Steps.Step title='Biên mục chi tiết' />
				</Steps>

				<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
					<BienMucSoLuoc form={form} />
				</div>
				<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
					<BienMucChiTiet form={form} />
				</div>

				<div className='form-footer'>
					{currentStep === 0 ? (
						<>
							<Button onClick={handleNext} type='primary'>
								Tiếp tục
							</Button>
							<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
						</>
					) : (
						<>
							<Button onClick={handlePrev}>Quay lại</Button>
							<ButtonExtend
								tooltip='Nếu lưu lại ấn phẩm sẽ ở vẫn trạng thái chờ biên mục chi tiết'
								loading={formSubmiting}
								type='primary'
								onClick={() => {
									setActionType(ETrangThaiBienMuc.CHO_BIEN_MUC);
									handleSubmit();
								}}
							>
								Lưu lại
							</ButtonExtend>
							<ButtonExtend
								tooltip='Nếu hoàn thành ấn phẩm sẽ chuyển trạng thái đã biên mục chi tiết'
								loading={formSubmiting}
								type='primary'
								onClick={() => {
									setActionType(ETrangThaiBienMuc.DA_BIEN_MUC);
									handleSubmit();
								}}
							>
								Hoàn thành
							</ButtonExtend>
							<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
						</>
					)}
				</div>
			</Form>
		</Modal>
	);
};

export default FormZ3950;
