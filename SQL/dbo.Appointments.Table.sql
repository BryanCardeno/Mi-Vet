USE [MiVet]
GO
/****** Object:  Table [dbo].[Appointments]    Script Date: 11/15/2022 12:38:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointments](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AppointmentTypeId] [int] NOT NULL,
	[ClientId] [int] NOT NULL,
	[VetProfileId] [int] NOT NULL,
	[Notes] [nvarchar](2000) NULL,
	[LocationId] [int] NOT NULL,
	[IsConfirmed] [bit] NOT NULL,
	[AppointmentStart] [datetime2](7) NOT NULL,
	[AppointmentEnd] [datetime2](7) NOT NULL,
	[StatusTypeId] [int] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
	[PatientId] [int] NULL,
 CONSTRAINT [PK_Appointments] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Appointments] ADD  CONSTRAINT [DF_Appointments_IsConfirmed]  DEFAULT ((0)) FOR [IsConfirmed]
GO
ALTER TABLE [dbo].[Appointments] ADD  CONSTRAINT [DF_Appointments_StatusTypeId]  DEFAULT ((1)) FOR [StatusTypeId]
GO
ALTER TABLE [dbo].[Appointments] ADD  CONSTRAINT [DF_Appointments_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[Appointments] ADD  CONSTRAINT [DF_Appointments_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_PatientId_on_HorseProfilesId] FOREIGN KEY([PatientId])
REFERENCES [dbo].[HorseProfiles] ([Id])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_PatientId_on_HorseProfilesId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentsAppointmentTypeId_AppointmentTypesId] FOREIGN KEY([AppointmentTypeId])
REFERENCES [dbo].[AppointmentTypes] ([Id])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_AppointmentsAppointmentTypeId_AppointmentTypesId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentsClientId_UsersId] FOREIGN KEY([ClientId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_AppointmentsClientId_UsersId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentsCreatedBy_UsersId] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_AppointmentsCreatedBy_UsersId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentsLocationId_LocationsId] FOREIGN KEY([LocationId])
REFERENCES [dbo].[Locations] ([Id])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_AppointmentsLocationId_LocationsId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentsModifiedBy_UsersId] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_AppointmentsModifiedBy_UsersId]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentsStatusTypeId_StatusTypesId] FOREIGN KEY([StatusTypeId])
REFERENCES [dbo].[StatusTypes] ([Id])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_AppointmentsStatusTypeId_StatusTypesId]
GO
