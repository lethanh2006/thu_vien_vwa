import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectKyXuatBan from '@/pages/DanhMuc/KyXuatBan/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormAnPhamDinhKy = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		edit,
		isView,
		record,
		visibleForm,
		formSubmiting,
		setVisibleForm,
		setFormSubmiting,
		postBienMucSoLuocModel,
		putModel,
	} = useModel('anphamdinhky.anphamdinhky');
	const { initialState } = useModel('@@initialState');

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || '');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}

		if (!record?._id) {
			form.setFieldsValue({
				canBoBienMuc: fullName,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AnPhamDinhKy.IRecord) => {
		setFormSubmiting(true);
		const anhBiaUrl = await buildUpLoadFile(values, 'anhBiaUrl').finally(() => setFormSubmiting(false));
		values.anhBiaUrl = anhBiaUrl ?? '';

		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postBienMucSoLuocModel(values)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} ấn phẩm định kỳ`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Row gutter={[12, 0]}>
									<Col xs={24} md={6}>
										<Form.Item name='anhBiaUrl' label=''>
											<UploadFile isPortraitAvatar buttonDescription='Thêm ảnh bìa' />
										</Form.Item>
									</Col>
									<Col xs={24} md={18}>
										<Row gutter={[12, 0]}>
											<Col xs={24} md={12}>
												<Form.Item name='canBoBienMuc' label='Cán bộ biên mục [911]'>
													<Input placeholder='Nhập tên cán bộ' />
												</Form.Item>
											</Col>

											<Col xs={24} md={12}>
												<Form.Item name='maDangTaiLieu' label='Dạng tài liệu [927]' rules={[...rules.required]}>
													<SelectDangTaiLieu selectMa />
												</Form.Item>
											</Col>

											<Col xs={24} md={12}>
												<Form.Item name='issn' label='ISBN [020$a]'>
													<Input placeholder='Nhập ISBN' />
												</Form.Item>
											</Col>

											<Col xs={24} md={12}>
												<Form.Item name='kyXuatBanId' label='Kỳ xuất bản'>
													<SelectKyXuatBan />
												</Form.Item>
											</Col>
										</Row>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Row gutter={[12, 0]}>
							<Col xs={24} md={12}>
								<Form.Item name='mauBienMucId' label='Mẫu biên mục' rules={[...rules.required]}>
									<SelectMauBienMuc />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='ten' label='Tên ấn phẩm định kỳ'>
									<Input placeholder='Nhập tên ấn phẩm định kỳ' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='nhaXuatBan' label='Nhà xuất bản'>
									<Input placeholder='Nhập nhà xuất bản' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='noiXuatBan' label='Nơi xuất bản'>
									<Input placeholder='Nhập nơi xuất bản' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='namXuatBan' label='Năm xuất bản'>
									<InputNumber style={{ width: '100%' }} placeholder='Nhập năm xuất bản' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='khuonKho' label='Khuôn khổ [300$c]'>
									<Input placeholder='Nhập khuôn khổ' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='soTrang' label='Số trang [300$a]'>
									<InputNumber style={{ width: '100%' }} placeholder='Nhập số trang' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='dacDiemVatLy' label='Đặc điểm vật lý [300$b]'>
									<Input placeholder='Nhập đặc điểm vật lý' />
								</Form.Item>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Form.Item name='ghiChu' label='Ghi chú'>
							<Input placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='tomTat' label='Tóm tắt'>
							<TinyEditor height={300} hideMenubar miniToolbar stickyToolbar={false} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Biên mục' : `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormAnPhamDinhKy;
