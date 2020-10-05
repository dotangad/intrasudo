module.exports = ({ content, title }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin: 0; padding: 0;">
	<table border="0" cellpadding="0" cellspacing="0" width="100%" style=" font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">	
		<tr>
			<td style="padding: 0 0 30px 0;">
				<table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px; color: #333; max-width: 600px; width: 100%;">
					<tr>
						<td align="center" style="padding: 30px 0;">
							<img src="https://github.com/exunclan/exunclan.github.io/blob/develop/src/images/logo.png?raw=true" alt="Exun Clan" width="215" height="81" style="display: block;" />
						</td>
					</tr>
					<tr>
						<td style="padding: 0 30px 30px 30px;">
							<table border="0" cellpadding="0" cellspacing="0" width="100%">
								<!-- <tr>
									<td style="color: #333; font-size: 24px; text-align: center; padding-bottom: 10px;">
										<b>${title}</b>
									</td>
								</tr> -->
								${content}
                <tr>
                  <td style="padding: 10px 0;">
                    We look forward to seeing you at Exun 2020!
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td style="padding: 0 30px 30px 30px;">
							<table border="0" cellpadding="0" cellspacing="0" width="100%">
								<tr>
									<td width="75%">
										&copy; Exun Clan 2020<br/>
                    <a href="https://dpsrkp.net/" style="color: #333;">Delhi Public School, R.K. Puram</a>
									</td>
									<td align="right" width="25%">
										<table border="0" cellpadding="0" cellspacing="0">
											<tr>
												<td>
													<a href="https://exunclan.com" style="color: #ffffff;">
                            <img src="https://i.ibb.co/tztxz8y/web.png" alt="Facebook" width="20" height="20" style="display: block;" border="0" />
													</a>
												</td>
												<td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
												<td>
													<a href="https://facebook.com/ExunClan">
                            <img src="https://i.ibb.co/4MZzKk8/facebook.png" alt="Facebook" width="20" height="20" style="display: block;" border="0" />
													</a>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`;