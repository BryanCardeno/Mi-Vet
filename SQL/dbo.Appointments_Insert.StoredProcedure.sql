USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Insert]    Script Date: 11/15/2022 12:38:21 AM ******/
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

CREATE PROC [dbo].[Appointments_Insert]
			@AppointmentTypeId int
			,@ClientId int
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
			,@ClientId int = 30
			,@VetProfileId int = 4
			,@Notes nvarchar(2000) = 'Notes Test'
			,@LocationId int = 5
			,@AppointmentStart datetime2(7) = '2022-09-21'
			,@AppointmentEnd datetime2(7) = '2022-09-22'
			,@CreatedBy int = 30
			,@Id int = 0;

EXECUTE dbo.Appointments_Insert
			@AppointmentTypeId
			,@ClientId
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
