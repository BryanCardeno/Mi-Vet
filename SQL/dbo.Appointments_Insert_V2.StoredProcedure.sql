USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Insert_V2]    Script Date: 11/15/2022 12:38:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Bryan Cardeno
-- Create date: September 22, 2022
-- Description: Proc for inserting appointments to DB
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE: 9/26/2022
-- Code Reviewer: Adam Leymeister
-- Note:
-- =============================================

CREATE PROC [dbo].[Appointments_Insert_V2]
			@AppointmentTypeId int
			,@ClientId int
			,@PatientId int
			,@VetProfileId int
			,@Notes nvarchar(2000)
			,@LocationId int
			,@AppointmentStart datetime2(7)
			,@AppointmentEnd datetime2(7)
			,@UserId int
			,@Id int OUTPUT

AS
/*
-------- TEST CODE --------

DECLARE @AppointmentTypeId int = 1
			,@ClientId int = 77
			,@PatientId int = 131
			,@VetProfileId int = 52
			,@Notes nvarchar(2000) = 'Test New'
			,@LocationId int = 5
			,@AppointmentStart datetime2(7) = '2022-11-07'
			,@AppointmentEnd datetime2(7) = '2022-11-07'
			,@CreatedBy int = 41
			,@Id int = 0;

EXECUTE dbo.Appointments_Insert_V2
			@AppointmentTypeId
			,@ClientId
			,@PatientId
			,@VetProfileId
			,@Notes
			,@LocationId
			,@AppointmentStart
			,@AppointmentEnd
			,@CreatedBy
			,@Id OUTPUT


SELECT @Id as AfterExec

SELECT * FROM dbo.Appointments
*/
BEGIN


	INSERT INTO dbo.Appointments
					([AppointmentTypeId]
					,[ClientId]
					,[PatientId]
					,[VetProfileId]
					,[Notes]
					,[LocationId]
					,[AppointmentStart]
					,[AppointmentEnd]
					,[CreatedBy]
					,[ModifiedBy])
	VALUES
					(@AppointmentTypeId
					,@ClientId
					,@PatientId
					,@VetProfileId
					,@Notes
					,@LocationId
					,@AppointmentStart
					,@AppointmentEnd
					,@UserId
					,@UserId)

	SET @Id = SCOPE_IDENTITY()

	

END
GO
