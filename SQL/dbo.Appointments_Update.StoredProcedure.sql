USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Update]    Script Date: 11/15/2022 12:38:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Bryan Cardeno
-- Create date: September 22, 2022
-- Description: Proc for updating Appointments
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE: 09/22/2022
-- Code Reviewer: Adam Leymeister
-- Note:
-- =============================================
CREATE PROC [dbo].[Appointments_Update]
			@Id int
			,@AppointmentTypeId int
			,@ClientId int
			,@VetProfileId int
			,@Notes nvarchar(2000)
			,@LocationId int
			,@IsConfirmed bit
			,@AppointmentStart datetime2(7)
			,@AppointmentEnd datetime2(7)
			,@StatusTypeId int
			,@PatientId int
			,@UserId int
			
AS
/*
----- TEST CODE -------
DECLARE		@Id int = 3
			,@AppointmentTypeId int = 1
			,@ClientId int = 30
			,@VetProfileId int = 4
			,@Notes nvarchar(2000) = 'Updated Notes Test'
			,@LocationId int = 5
			,@IsConfirmed bit = 0
			,@AppointmentStart datetime2(7) = '2022-09-21'
			,@AppointmentEnd datetime2(7) = '2022-09-22'
			,@StatusTypeId int = 1
			,@UserId int = 30;

SELECT *
FROM dbo.Appointments
WHERE [Id] = @Id


EXECUTE dbo.Appointments_Update
		@Id
		,@AppointmentTypeId
		,@ClientId
		,@VetProfileId
		,@Notes
		,@LocationId
		,@IsConfirmed
		,@AppointmentStart
		,@AppointmentEnd
		,@StatusTypeId
		,@UserId

SELECT *
FROM dbo.Appointments
WHERE [Id] = @Id
			
*/
BEGIN

	UPDATE dbo.Appointments
	SET [AppointmentTypeId] = @AppointmentTypeId
		,[ClientId] = @ClientId
		,[VetProfileId] = @VetProfileId
		,[Notes] = @Notes
		,[LocationId] = @LocationId
		,[IsConfirmed] = @IsConfirmed
		,[AppointmentStart] = @AppointmentStart
		,[AppointmentEnd] = @AppointmentEnd
		,[StatusTypeId] = @StatusTypeId
		,[DateModified] = GETUTCDATE()
		,[ModifiedBy] = @UserId
		,[PatientId] = @PatientId
	WHERE [Id] = @Id

END
GO
